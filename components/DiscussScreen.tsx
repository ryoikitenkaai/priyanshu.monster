"use client";

import { useGameStore } from "@/lib/gameStore";
import styles from "./discuss.module.css";
import ReactConfetti from "react-confetti"; // Let's not use it here to avoid dependency, simply relying on previous visuals

export default function DiscussScreen() {
  const { toggleReadyToVote, toggleChangeWord, players, wordPair, myPlayerId } = useGameStore();

  const me = players.find(p => p.id === myPlayerId);
  const myWord = me?.isImposter ? wordPair?.imposterWord : wordPair?.normalWord;

  const readyCount = players.filter(p => p.readyToVote).length;
  const changeWordCount = players.filter(p => p.wantsToChangeWord).length;
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

      <div className={`${styles.wordWrap} animate-fadeUp stagger-2`} style={{ marginTop: '2rem' }}>
        <p style={{fontSize: '0.9rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '2px'}}>Your Word</p>
        <h1 style={{fontSize: 'min(3rem, 12vw)', margin: '0.5rem 0', fontWeight: 'bold', wordBreak: 'break-word', hyphens: 'auto'}} className="gradient-text">{myWord}</h1>
        {me?.isImposter && <p style={{color: 'var(--accent-red)', fontSize: '0.9rem'}}>You are the imposter! Try to blend in.</p>}
      </div>

      <div className={`glass-card ${styles.hintCard} animate-fadeUp stagger-3`}>
        <p className={styles.hintLabel}>💡 Category Hint</p>
        <p className={styles.hintText}>{wordPair?.hint}</p>
      </div>

      <div className={`${styles.playersWrap} animate-fadeUp stagger-3`}>
        {players.map((p) => (
          <div key={p.id} className={`glass-card ${styles.playerChip}`} style={{ borderColor: p.readyToVote ? 'var(--accent-green)' : (p.wantsToChangeWord ? 'var(--accent-orange)' : 'transparent') }}>
            <div className={styles.playerAv}>{p.name.charAt(0).toUpperCase()}</div>
            <span>{p.name} {p.readyToVote ? "✅" : (p.wantsToChangeWord ? "🔄" : "")}</span>
          </div>
        ))}
      </div>

      <div className={`${styles.controls} animate-fadeUp stagger-4`} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button 
          className="btn-primary" 
          onClick={toggleReadyToVote} 
          style={{ width: "100%", background: me?.readyToVote ? 'var(--accent-green)' : '' }}
        >
          {me?.readyToVote ? "Waiting for others..." : "Ready to Vote"} ({readyCount}/{majority})
        </button>
        <button 
          className="btn-secondary" 
          onClick={toggleChangeWord} 
          style={{ width: "100%", background: me?.wantsToChangeWord ? 'var(--accent-orange)' : '', borderColor: me?.wantsToChangeWord ? 'var(--accent-orange)' : '' }}
        >
          {me?.wantsToChangeWord ? "Waiting for others..." : "Change Word"} ({changeWordCount}/{majority})
        </button>
      </div>
    </div>
  );
}
