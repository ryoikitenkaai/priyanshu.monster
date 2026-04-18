import { RealtimeChannel } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "./supabase";
import { WORD_PAIRS } from "./words";

export type Phase = "setup" | "discuss" | "vote" | "result";

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  vote: string | null;
  readyToVote: boolean;
  wantsToChangeWord: boolean;
  isImposter: boolean;
  kicked: boolean;
}

export interface WordPair {
  normalWord: string;
  imposterWord: string;
}

interface GameState {
  roomCode: string;
  myPlayerId: string;
  myName: string;
  phase: Phase;
  players: Player[];
  wordPair: WordPair | null;
  channel: RealtimeChannel | null;
  playedWords: string[];
  wordStack: WordPair[];
  joinRoom: (roomCode: string, name: string) => void;
  startGame: (wordPair: WordPair) => void;
  toggleReadyToVote: () => void;
  toggleChangeWord: () => void;
  castVote: (suspectId: string) => void;
  playAgain: () => void;
  leaveRoom: () => void;
  popWordPair: () => WordPair;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const normalizeWord = (word: string) => word.trim().toLowerCase();

const withUniquePlayedWords = (playedWords: string[], nextWords: string[]) => {
  const seen = new Set(playedWords.map(normalizeWord));
  const out = [...playedWords];

  for (const word of nextWords) {
    const key = normalizeWord(word);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(word);
    }
  }

  return out;
};

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
      playedWords: [],
      wordStack: [...WORD_PAIRS].sort(() => Math.random() - 0.5),

      joinRoom: (code, name) => {
        get().channel?.unsubscribe();

        const roomCode = code.toUpperCase();
        const current = get();
        const isSameSession =
          Boolean(current.myPlayerId) &&
          current.myName === name &&
          current.roomCode === roomCode;
        const myPlayerId = isSameSession ? current.myPlayerId : generateId();
        const existingSelf = current.players.find((p) => p.id === myPlayerId);

        const newPlayer: Player = existingSelf ?? {
          id: myPlayerId,
          name,
          isHost: false,
          vote: null,
          readyToVote: false,
          wantsToChangeWord: false,
          isImposter: false,
          kicked: false,
        };

        const channel = supabase.channel(`room:${roomCode}`, {
          config: {
            broadcast: { self: true },
            presence: { key: myPlayerId },
          },
        });

        channel
          .on("presence", { event: "sync" }, () => {
            const state = channel.presenceState();
            const activeIds = Object.keys(state);

            set((currentState) => {
              const allIds = Array.from(new Set([...activeIds, ...currentState.players.map(p => p.id)]));
              
              const updatedPlayers = allIds
                .map((id) => {
                  const presenceData = state[id]?.[0] as { player?: Player } | undefined;
                  const fromPresence = presenceData?.player;
                  const existing = currentState.players.find((p) => p.id === id);

                  // Keep players even if they briefly drop to ensure persistence
                  if (!fromPresence && existing) {
                    // Only keep them if we're not in setup (cleanup ghost players in lobby)
                    if (currentState.phase === "setup" && !activeIds.includes(id)) {
                      return null;
                    }
                    return existing;
                  }

                  if (!fromPresence) {
                    return existing!;
                  }

                  if (!existing) {
                    return fromPresence;
                  }

                  return {
                    ...existing, // Local existing state should have higher priority for things like isImposter
                    ...fromPresence, // Presence brings online details like name
                    id,
                    name: fromPresence.name || existing.name,
                    isHost: existing.isHost, // preserve host
                    isImposter: existing.isImposter, // preserve secretly assigned role
                    vote: existing.vote,
                  };
                })
                .filter((p): p is Player => p !== null)
                .sort((a, b) => a.name.localeCompare(b.name));

              if (updatedPlayers.length > 0) {
                // Ensure there's an ONLINE host, preferring the existing host if they're still around
                const existingHost = updatedPlayers.find((p) => p.isHost && activeIds.includes(p.id));
                if (!existingHost) {
                  updatedPlayers.forEach((p) => { p.isHost = false; });
                  const firstOnline = updatedPlayers.find((p) => activeIds.includes(p.id));
                  if (firstOnline) {
                    firstOnline.isHost = true;
                  }
                }
              }

              return { players: updatedPlayers };
            });
          })
          .on("broadcast", { event: "game_state_update" }, ({ payload }) => {
            set((state) => ({
              ...state,
              ...payload,
              playedWords: payload.playedWords ?? state.playedWords,
              players: payload.players ?? state.players,
            }));
          })
          .on("broadcast", { event: "player_update" }, ({ payload }) => {
            set((state) => {
              const newPlayers = state.players.map((p) =>
                p.id === payload.id ? { ...p, ...payload.updates } : p,
              );

              if (state.phase === "discuss") {
                const readyCount = newPlayers.filter((p) => p.readyToVote).length;
                const changeWordCount = newPlayers.filter((p) => p.wantsToChangeWord).length;
                const majority = Math.ceil(newPlayers.length / 2);
                const me = newPlayers.find((p) => p.id === state.myPlayerId);

                if (me?.isHost) {
                  if (changeWordCount >= majority) {
                    const resetPlayers = newPlayers.map((p) => ({
                      ...p,
                      wantsToChangeWord: false,
                      readyToVote: false,
                    }));

                    try {
                      const newWord = get().popWordPair();
                      const newState = {
                        wordPair: newWord,
                        players: resetPlayers,
                        playedWords: withUniquePlayedWords(state.playedWords || [], [
                          newWord.normalWord,
                          newWord.imposterWord,
                        ]),
                      };
                      channel.send({ type: "broadcast", event: "game_state_update", payload: newState });
                      set((s) => ({ ...s, ...newState }));
                    } catch {
                      // If it runs out, just reset their changeWord attempt
                      channel.send({ 
                        type: "broadcast", 
                        event: "game_state_update", 
                        payload: { players: resetPlayers }
                      });
                      set((s) => ({ ...s, players: resetPlayers }));
                    }

                    return { players: resetPlayers };
                  }

                  if (readyCount >= majority) {
                    const newState = { phase: "vote" as Phase };
                    channel.send({ type: "broadcast", event: "game_state_update", payload: newState });
                    return { players: newPlayers, ...newState };
                  }
                }
              }

              if (state.phase === "vote") {
                const votesCast = newPlayers.filter((p) => Boolean(p.vote)).length;
                const me = newPlayers.find((p) => p.id === state.myPlayerId);

                if (me?.isHost) {
                  const majority = Math.ceil(newPlayers.length / 2);
                  const voteCounts: Record<string, number> = {};

                  newPlayers.forEach((p) => {
                    if (p.vote) {
                      voteCounts[p.vote] = (voteCounts[p.vote] || 0) + 1;
                    }
                  });

                  let majorityId: string | null = null;
                  for (const [suspectId, count] of Object.entries(voteCounts)) {
                    if (count >= majority) {
                      majorityId = suspectId;
                      break;
                    }
                  }

                  if (majorityId) {
                    const finalPlayers = newPlayers.map((p) =>
                      p.id === majorityId ? { ...p, kicked: true } : p,
                    );
                    const resultState = { phase: "result" as Phase, players: finalPlayers };
                    channel.send({ type: "broadcast", event: "game_state_update", payload: resultState });
                    return resultState;
                  }

                  if (votesCast === newPlayers.length) {
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
                      const resetPlayers = newPlayers.map((p) => ({
                        ...p,
                        vote: null,
                        readyToVote: false,
                        wantsToChangeWord: false,
                      }));
                      const voidState = { phase: "discuss" as Phase, players: resetPlayers };
                      channel.send({ type: "broadcast", event: "game_state_update", payload: voidState });
                      return voidState;
                    }

                    const finalPlayers = newPlayers.map((p) =>
                      p.id === kickedId ? { ...p, kicked: true } : p,
                    );
                    const resultState = { phase: "result" as Phase, players: finalPlayers };
                    channel.send({ type: "broadcast", event: "game_state_update", payload: resultState });
                    return resultState;
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
          players: isSameSession && state.players.length > 0 ? state.players : [newPlayer],
          phase: isSameSession ? state.phase : "setup",
          wordPair: isSameSession ? state.wordPair : null,
        }));
      },

      startGame: (wordPair) => {
        const { players, channel, playedWords } = get();
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
          playedWords: withUniquePlayedWords(playedWords || [], [wordPair.normalWord, wordPair.imposterWord]),
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

        const me = players.find((p) => p.id === myPlayerId);
        if (!me) return;

        const updates = { readyToVote: !me.readyToVote };
        channel.send({
          type: "broadcast",
          event: "player_update",
          payload: { id: myPlayerId, updates },
        });

        set({ players: players.map((p) => (p.id === myPlayerId ? { ...p, ...updates } : p)) });
      },

      toggleChangeWord: () => {
        const { channel, myPlayerId, players } = get();
        if (!channel) return;

        const me = players.find((p) => p.id === myPlayerId);
        if (!me) return;

        const updates = { wantsToChangeWord: !me.wantsToChangeWord };
        channel.send({
          type: "broadcast",
          event: "player_update",
          payload: { id: myPlayerId, updates },
        });

        set({ players: players.map((p) => (p.id === myPlayerId ? { ...p, ...updates } : p)) });
      },

      castVote: (suspectId) => {
        const { channel, myPlayerId, players } = get();
        if (!channel) return;

        const updates = { vote: suspectId };
        channel.send({
          type: "broadcast",
          event: "player_update",
          payload: { id: myPlayerId, updates },
        });

        set({ players: players.map((p) => (p.id === myPlayerId ? { ...p, ...updates } : p)) });
      },

      playAgain: () => {
        const { channel, players } = get();
        if (!channel) return;

        const resetPlayers = players.map((p) => ({
          ...p,
          isImposter: false,
          readyToVote: false,
          wantsToChangeWord: false,
          vote: null,
          kicked: false,
        }));

        const newState = {
          phase: "setup" as Phase,
          wordPair: null,
          players: resetPlayers,
        };

        channel.send({
          type: "broadcast",
          event: "game_state_update",
          payload: newState,
        });

        set(newState);
      },

      leaveRoom: () => {
        const { channel } = get();
        if (channel) {
          channel.unsubscribe();
        }
        set({
          roomCode: "",
          myPlayerId: "",
          myName: "",
          players: [],
          phase: "setup",
          channel: null,
          wordPair: null,
        });
      },
      popWordPair: () => {
        const state = get();
        const stack = [...state.wordStack];
        let popped: WordPair | undefined;
        
        while (stack.length > 0) {
          popped = stack.pop()!;
          const normalKey = normalizeWord(popped.normalWord);
          const impKey = normalizeWord(popped.imposterWord);
          const seen = new Set((state.playedWords || []).map(normalizeWord));
          
          if (!seen.has(normalKey) && !seen.has(impKey)) {
            break;
          }
          popped = undefined;
        }

        if (!popped) {
          throw new Error("No words left!");
        }

        set({ wordStack: stack });
        return popped;
      },
    }),
    {
      name: "word-imposter-storage",
      partialize: (state) => ({
        roomCode: state.roomCode,
        myPlayerId: state.myPlayerId,
        myName: state.myName,
        phase: state.phase,
        wordPair: state.wordPair,
        playedWords: state.playedWords,
        wordStack: state.wordStack,
        players: state.players,
      }),
    },
  ),
);
