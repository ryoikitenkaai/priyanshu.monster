import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase } from "./supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

export type Phase = "setup" | "discuss" | "vote" | "result";

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  vote: string | null;     // ID of the person they voted for
  readyToVote: boolean;    // For discussion phase
  wantsToChangeWord: boolean; // For changing word
  isImposter: boolean;
  kicked: boolean;
}

export interface WordPair {
  normalWord: string;
  imposterWord: string;
  category: string;
  hint: string;
}

interface GameState {
  roomCode: string;
  myPlayerId: string;
  myName: string;
  phase: Phase;
  players: Player[];
  wordPair: WordPair | null;
  channel: RealtimeChannel | null;

  // Actions
  joinRoom: (roomCode: string, name: string) => void;
  startGame: (wordPair: WordPair) => void;
  toggleReadyToVote: () => void;
  toggleChangeWord: () => void;
  castVote: (suspectId: string) => void;
  playAgain: () => void;
  leaveRoom: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      roomCode: "",
      myPlayerId: "",
      myName: "",
      phase: "setup",
      players: [],
      wordPair: null,
      channel: null,

      joinRoom: (code, name) => {
        // Leave previous room if any
        get().channel?.unsubscribe();

        const roomCode = code.toUpperCase();
        // If we are re-joining the same room and same name, reuse the generated ID
        const currentMyPlayerId = get().myPlayerId;
        const currentMyName = get().myName;
        const currentRoomCode = get().roomCode;
        
        let myPlayerId = generateId();
        if (currentMyPlayerId && currentMyName === name && currentRoomCode === roomCode) {
          myPlayerId = currentMyPlayerId;
        }

        const channel = supabase.channel(`room:${roomCode}`, {
      config: {
        broadcast: { self: true },
        presence: { key: myPlayerId },
      },
    });

    const newPlayer: Player = {
      id: myPlayerId,
      name,
      isHost: false, 
      vote: null,
      readyToVote: false,
      wantsToChangeWord: false,
      isImposter: false,
      kicked: false,
    };

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const activeIds = Object.keys(state);

        set((current) => {
          const currentPlayers = [...current.players];

          // Rebuild players list based on who is actually present right now
          let updatedPlayers = activeIds.map((id) => {
            const presenceData = state[id][0] as any;
            const existing = currentPlayers.find((p) => p.id === id);
            return existing || presenceData.player;
          });

          // Sort so things don't jump around, and assign host to the first connected person
          updatedPlayers = updatedPlayers.sort((a, b) => a.name.localeCompare(b.name));

          if (updatedPlayers.length > 0) {
            // Reset all host flags
            updatedPlayers.forEach(p => p.isHost = false);
            // First person is host
            updatedPlayers[0].isHost = true;
          }

          return { players: updatedPlayers };
        });
      })
      .on("broadcast", { event: "game_state_update" }, ({ payload }) => {
        set((state) => ({ ...state, ...payload }));
      })
      .on("broadcast", { event: "player_update" }, ({ payload }) => {
        // Individual player actions (ready to vote, cast vote)
        set((state) => {
          const newPlayers = state.players.map(p => p.id === payload.id ? { ...p, ...payload.updates } : p);
          
          // If in talk/discuss phase, check for majority
          if (state.phase === "discuss") {
            const readyCount = newPlayers.filter(p => p.readyToVote).length;
            const changeWordCount = newPlayers.filter(p => p.wantsToChangeWord).length;
            const majority = Math.ceil(newPlayers.length / 2);
            
            // Host handles the phase change specifically
            const me = newPlayers.find(p => p.id === state.myPlayerId);
            
            if (me?.isHost) {
              if (changeWordCount >= majority) {
                // Fetch a new word and reset wantsToChangeWord
                fetch('/api/words', { cache: 'no-store' }).then(async res => {
                  if (!res.ok) throw new Error("API failed");
                  const newWord = await res.json();
                  if (!newWord.normalWord) throw new Error("Invalid word");
                  const resetPlayers = newPlayers.map(p => ({ ...p, wantsToChangeWord: false, readyToVote: false }));
                  const newState = { wordPair: newWord, players: resetPlayers };
                  channel.send({ type: "broadcast", event: "game_state_update", payload: newState });
                  set((s) => ({ ...s, ...newState }));
                }).catch((err) => {
                  console.error("Change word failed:", err);
                  // Just reset flags if fetch outright fails so players aren't stuck and they keep the old word
                  const resetPlayers = newPlayers.map(p => ({ ...p, wantsToChangeWord: false, readyToVote: false }));
                  const newState = { players: resetPlayers, wordPair: state.wordPair }; // Always keep old wordPair on failure
                  channel.send({ type: "broadcast", event: "game_state_update", payload: newState });
                  set((s) => ({ ...s, ...newState }));
                });
                return { players: newPlayers.map(p => ({ ...p, wantsToChangeWord: false, readyToVote: false })), wordPair: state.wordPair }; // Maintain word pair optimistically
              }
              
              if (readyCount >= majority) {
                const newState = { phase: "vote" as Phase };
                channel.send({ type: "broadcast", event: "game_state_update", payload: newState });
                return { players: newPlayers, ...newState }; 
              }
            }
          }

          // If in vote phase check for completion or early majority
          if (state.phase === "vote") {
            const votesCast = newPlayers.filter(p => Boolean(p.vote)).length;
            const me = newPlayers.find(p => p.id === state.myPlayerId);
            
            if (me?.isHost) {
              const majority = Math.ceil(newPlayers.length / 2);
              
              // Tally votes
              const voteCounts: Record<string, number> = {};
              newPlayers.forEach(p => {
                if (p.vote) {
                  voteCounts[p.vote] = (voteCounts[p.vote] || 0) + 1;
                }
              });

              // Check if any player has reached majority
              let majorityReached = false;
              let majorityId: string | null = null;

              for (const [suspectId, count] of Object.entries(voteCounts)) {
                if (count >= majority) {
                  majorityReached = true;
                  majorityId = suspectId;
                  break;
                }
              }

              if (majorityReached && majorityId) {
                // Someone reached majority - kick them and end vote
                const finalPlayers = newPlayers.map(p => p.id === majorityId ? { ...p, kicked: true } : p);
                const resultState = { phase: "result" as Phase, players: finalPlayers };
                channel.send({ type: "broadcast", event: "game_state_update", payload: resultState });
                return resultState;
              } else if (votesCast === newPlayers.length) {
                // Everyone voted but no majority hit (or a tie)
                let maxVotes = 0;
                let kickedId: string | null = null;
                let tie = false;

                for (const [suspectId, count] of Object.entries(voteCounts)) {
                  if (count > maxVotes) {
                    maxVotes = count;
                    kickedId = suspectId;
                    tie = false;
                  } else if (count === maxVotes) {
                    tie = true;
                  }
                }

                if (tie || !kickedId) {
                  // Void the vote and return to discuss
                  const resetPlayers = newPlayers.map(p => ({ ...p, vote: null, readyToVote: false, wantsToChangeWord: false }));
                  const voidState = { phase: "discuss" as Phase, players: resetPlayers };
                  channel.send({ type: "broadcast", event: "game_state_update", payload: voidState });
                  return voidState;
                } else {
                  // Someone got the most votes but didn't reach majority (only possible if tie conditions fail, 
                  // but we catch those. Still safely kick if they somehow won)
                  const finalPlayers = newPlayers.map(p => p.id === kickedId ? { ...p, kicked: true } : p);
                  const resultState = { phase: "result" as Phase, players: finalPlayers };
                  channel.send({ type: "broadcast", event: "game_state_update", payload: resultState });
                  return resultState;
                }
              }
            }
          }

          return { players: newPlayers };
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ player: newPlayer });
        }
      });

    set((state) => ({ 
      roomCode, 
      myPlayerId, 
      myName: name,
      channel, 
      players: [newPlayer],
      // We do NOT overwrite phase if we are reconnecting to a game already in progress
      phase: state.phase === "result" ? "setup" : state.phase
    }));
  },

  startGame: (wordPair) => {
    const { players, channel } = get();
    if (!channel) return;

    const imposterIndex = Math.floor(Math.random() * players.length);

    const assignedPlayers = players.map((p, index) => ({
      ...p,
      isImposter: index === imposterIndex,
      readyToVote: false,
      wantsToChangeWord: false,
      vote: null,
      kicked: false,
    }));

    const newState = {
      phase: "discuss" as Phase,
      wordPair,
      players: assignedPlayers,
    };

    channel.send({
      type: "broadcast",
      event: "game_state_update",
      payload: newState,
    });

    set(newState);
  },

  toggleReadyToVote: () => {
    const { channel, myPlayerId, players } = get();
    if (!channel) return;

    const me = players.find(p => p.id === myPlayerId);
    if (!me) return;

    const updates = { readyToVote: !me.readyToVote };

    channel.send({
      type: "broadcast",
      event: "player_update",
      payload: { id: myPlayerId, updates }
    });

    set({ players: players.map(p => p.id === myPlayerId ? { ...p, ...updates } : p) });
  },

  toggleChangeWord: () => {
    const { channel, myPlayerId, players } = get();
    if (!channel) return;

    const me = players.find(p => p.id === myPlayerId);
    if (!me) return;

    const updates = { wantsToChangeWord: !me.wantsToChangeWord };

    channel.send({
      type: "broadcast",
      event: "player_update",
      payload: { id: myPlayerId, updates }
    });

    set({ players: players.map(p => p.id === myPlayerId ? { ...p, ...updates } : p) });
  },

  castVote: (suspectId) => {
    const { channel, myPlayerId, players } = get();
    if (!channel) return;

    const updates = { vote: suspectId };

    channel.send({
      type: "broadcast",
      event: "player_update",
      payload: { id: myPlayerId, updates }
    });

    set({ players: players.map(p => p.id === myPlayerId ? { ...p, ...updates } : p) });
  },

  playAgain: () => {
    const { channel, players } = get();
    if (!channel) return;

    const resetPlayers = players.map(p => ({
      ...p,
      isImposter: false,
      readyToVote: false,
      wantsToChangeWord: false,
      vote: null,
      kicked: false
    }));

    const newState = {
      phase: "setup" as Phase,
      wordPair: null,
      players: resetPlayers,
    };

    channel.send({
      type: "broadcast",
      event: "game_state_update",
      payload: newState
    });

    set(newState);
  },

  leaveRoom: () => {
    const { channel } = get();
    if (channel) {
      channel.unsubscribe();
    }
    set({ roomCode: "", myPlayerId: "", myName: "", players: [], phase: "setup", channel: null, wordPair: null });
  }
}),
{
  name: 'word-imposter-storage',
  partialize: (state) => ({ 
    roomCode: state.roomCode, 
    myPlayerId: state.myPlayerId, 
    myName: state.myName,
    phase: state.phase, // we keep the phase so the initial render knows what screen to show
    wordPair: state.wordPair // keep wordPair too, but we depend on GameState update for true sync
  }),
}
));
