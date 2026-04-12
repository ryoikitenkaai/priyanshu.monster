"use client";

import { useGameStore } from "@/lib/gameStore";
import styles from "./discuss.module.css";
import ReactConfetti from "react-confetti"; // Let's not use it here to avoid dependency, simply relying on previous visuals

export default function DiscussScreen() {
  const { toggleReadyToVote, players, wordPair, myPlayerId } = useGameStore();

  const me = players.find(p => p.id === myPlayerId);
  const myWord = me?.isImposter ? wordPair?.imposterWord : wordPair?.normalWord;

  const readyCount = players.filter(p => p.readyToVote).length;
  const majority = Math.ceil(players.length / 2);

  return (
    <div className={styles.container}>
      <div className={`${styles.header} animate-fadeUp`}>
        <span className="badge badge-purple">💬 Discussion Phase</span>
        <h2 className={styles.title}>Discuss &amp; Deduce</h2>
        <p className={styles.subtitle}>
          Describe your word without saying it directly. Find the imposter!
        </p>
      </div>

      <div className={`${styles.timerWrap} animate-fadeUp stagger-2`} style={{ marginTop: '2rem' }}>
        <p style={{fontSize: '0.9rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '2px'}}>Your Word</p>
        <h1 style={{fontSize: '3rem', margin: '0.5rem 0', fontWeight: 'bold'}} className="gradient-text">{myWord}</h1>
        {me?.isImposter && <p style={{color: 'var(--accent-red)', fontSize: '0.9rem'}}>You are the imposter! Try to blend in.</p>}
      </div>

      <div className={`glass-card ${styles.hintCard} animate-fadeUp stagger-3`}>
        <p className={styles.hintLabel}>💡 Category Hint</p>
        <p className={styles.hintText}>{wordPair?.hint}</p>
      </div>

      <div className={`${styles.playersWrap} animate-fadeUp stagger-3`}>
        {players.map((p) => (
          <div key={p.id} className={`glass-card ${styles.playerChip}`} style={{ borderColor: p.readyToVote ? 'var(--accent-green)' : 'transparent' }}>
            <div className={styles.playerAv}>{p.name.charAt(0).toUpperCase()}</div>
            <span>{p.name} {p.readyToVote ? "✅" : ""}</span>
          </div>
        ))}
      </div>

      <div className={`${styles.controls} animate-fadeUp stagger-4`}>
        <button 
          className="btn-primary" 
          onClick={toggleReadyToVote} 
          style={{ width: "100%", background: me?.readyToVote ? 'var(--accent-green)' : '' }}
        >
          {me?.readyToVote ? "Waiting for others..." : "Ready to Vote"} ({readyCount}/{players.length})
        </button>
      </div>
    </div>
  );
}
