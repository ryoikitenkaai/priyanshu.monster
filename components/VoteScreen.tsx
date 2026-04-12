"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/gameStore";
import styles from "./vote.module.css";

export default function VoteScreen() {
  const { players, castVote, myPlayerId } = useGameStore();

  const me = players.find(p => p.id === myPlayerId);
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(me?.vote || null);

  const handleVote = (suspectId: string) => {
    // Only allow voting once per round
    if (me?.vote) return;
    
    setSelectedSuspect(suspectId);
    castVote(suspectId);
  };

  const totalPlayers = players.length;
  const votesCast = players.filter(p => Boolean(p.vote)).length;
  const progress = (votesCast / totalPlayers) * 100;

  return (
    <div className={styles.container}>
      {/* Progress */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <div className={`${styles.header} animate-fadeUp`}>
        <span className="badge badge-red">🗳 Voting Phase</span>
        {me?.vote ? (
          <h2 className={styles.title}>Waiting for others...</h2>
        ) : (
          <h2 className={styles.title}>Time to vote</h2>
        )}
        <p className={styles.subtitle}>Who do you think got the different word?</p>
      </div>

      {/* Suspect grid */}
      <div className={`${styles.grid} animate-fadeUp stagger-2`}>
        {players
          .filter((p) => p.id !== me?.id)
          .map((p) => {
            const isSelected = selectedSuspect === p.id;
            return (
              <button
                disabled={Boolean(me?.vote)}
                key={p.id}
                className={`${styles.playerCard} glass-card ${isSelected ? styles.selected : ""}`}
                style={{ opacity: me?.vote && !isSelected ? 0.5 : 1 }}
                onClick={() => handleVote(p.id)}
              >
                <div className={styles.cardAvatar}>{p.name.charAt(0).toUpperCase()}</div>
                <span className={styles.cardName}>{p.name}</span>
                {isSelected && (
                  <span className={styles.selectedBadge}>🎯 Voted!</span>
                )}
              </button>
            )
          })}
      </div>

      {/* Confirm Footer Display - no manual confirmation needed since it votes instantly and tells server */}
      <div className={`${styles.confirmBar} animate-fadeUp`}>
        <p className={styles.passNote} style={{fontSize: '1rem', color: 'white', textAlign: 'center'}}>
          {votesCast} of {totalPlayers} players have voted
        </p>
      </div>
    </div>
  );
}
