"use client";

import { useGameStore } from "@/lib/gameStore";
import styles from "./result.module.css";
import ReactConfetti from "react-confetti";

function Confetti() {
  const colors = ["#a855f7", "#ec4899", "#3b82f6", "#22c55e", "#eab308", "#f97316"];
  const pieces = Array.from({ length: 40 });
  return (
    <div className={styles.confettiWrapper} aria-hidden="true">
      {pieces.map((_, i) => (
        <div
          key={i}
          className={styles.confettiPiece}
          style={{
            left: `${Math.random() * 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

export default function ResultScreen() {
  const { players, wordPair, playAgain, myPlayerId } = useGameStore();

  const me = players.find((p) => p.id === myPlayerId);
  const imposter = players.find(p => p.isImposter);
  const ejectedPlayer = players.find(p => p.kicked);
  
  const imposterCaught = ejectedPlayer?.id === imposter?.id;

  // Tally votes
  const voteTally: Record<string, number> = {};
  players.forEach((p) => {
    if (p.vote) voteTally[p.vote] = (voteTally[p.vote] || 0) + 1;
  });

  const maxVotes = Math.max(...Object.values(voteTally), 0);

  return (
    <div className={styles.container}>
      {imposterCaught && <Confetti />}

      {/* Result banner (Among Us style) */}
      <div className={`${styles.banner} animate-fadeUp`} style={{marginTop: '2rem', padding: '2rem'}}>
        {ejectedPlayer ? (
          <>
            <h1 className={styles.resultTitle} style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white'}}>
              {ejectedPlayer.name} was ejected.
            </h1>
            <p className={styles.resultSub} style={{ fontSize: '1.2rem', color: imposterCaught ? 'var(--accent-green)' : 'var(--accent-red)'}}>
              {imposterCaught ? "They were the Imposter." : "They were NOT the Imposter."}
            </p>
          </>
        ) : (
          <h1 className={styles.resultTitle}>Someone escaped</h1>
        )}
      </div>

      {/* Imposter reveal */}
      <div className={`glass-card ${styles.imposterCard} animate-fadeUp stagger-2 ${imposterCaught ? "glow-purple" : "glow-red"}`}>
        <p className={styles.sectionLabel}>🕵️ The Imposter Was</p>
        <div className={styles.imposterAvatar}>
          {imposter?.name.charAt(0).toUpperCase()}
        </div>
        <h2 className={styles.imposterName}>{imposter?.name}</h2>
      </div>

      {/* Words reveal */}
      <div className={`${styles.wordsRow} animate-fadeUp stagger-3`}>
        <div className={`glass-card ${styles.wordBox}`}>
          <p className={styles.wordBoxLabel}>Crewmate's Word</p>
          <p className={styles.wordBoxValue}>{wordPair?.normalWord}</p>
        </div>
        <div className={styles.vs}>VS</div>
        <div className={`glass-card ${styles.wordBox} ${styles.imposterBox}`}>
          <p className={styles.wordBoxLabel}>Imposter's Word</p>
          <p className={`${styles.wordBoxValue} gradient-text`}>{wordPair?.imposterWord}</p>
        </div>
      </div>

      {/* Vote tally */}
      <div className={`glass-card ${styles.tallyCard} animate-fadeUp stagger-3`}>
        <p className={styles.sectionLabel}>📊 Vote Results</p>
        <div className={styles.tallyList}>
          {players.map((p) => {
            const votes = voteTally[p.id] || 0;
            const barWidth = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
            const isImposter = p.id === imposter?.id;
            return (
              <div key={p.id} className={styles.tallyRow}>
                <div className={styles.tallyName}>
                  <span className={styles.tallyAvatar}>{p.name.charAt(0).toUpperCase()}</span>
                  <span>{p.name} {p.kicked && "💀"}</span>
                  {isImposter && <span className={styles.spyTag}>🕵️</span>}
                </div>
                <div className={styles.tallyBarWrap}>
                  <div
                    className={`${styles.tallyBar} ${isImposter ? styles.tallyBarRed : styles.tallyBarPurple}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className={styles.tallyCount}>{votes}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category */}
      <div className={`${styles.categoryChip} animate-fadeUp stagger-4`}>
        <span className="badge badge-purple">
          📂 {wordPair?.category}
        </span>
      </div>

      {/* Play again */}
      {me?.isHost ? (
        <button
          className={`btn-primary ${styles.playAgainBtn} animate-fadeUp stagger-5`}
          onClick={playAgain}
          id="play-again-btn"
        >
          🔄 Play Again (Host)
        </button>
      ) : (
        <div className={`${styles.timerCard} animate-fadeUp stagger-5`} style={{textAlign: "center", padding: 20}}>
            <p>Waiting for host to play again...</p>
        </div>
      )}
    </div>
  );
}
