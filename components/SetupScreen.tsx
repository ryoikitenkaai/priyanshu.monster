"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/gameStore";
import styles from "./setup.module.css";
import { useRouter } from "next/navigation";

export default function SetupScreen({ initialRoom = "" }: { initialRoom?: string }) {
  const [nameInput, setNameInput] = useState("");
  const [roomInput, setRoomInput] = useState(initialRoom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { roomCode, players, myName, joinRoom, startGame, leaveRoom } = useGameStore();

  const handleJoin = () => {
    const pName = nameInput.trim();
    if (!pName) {
      setError("Please enter your name");
      return;
    }
    
    // If room is empty, create a random 4-letter one
    let targetRoom = roomInput.trim().toUpperCase();
    if (!targetRoom) {
      targetRoom = Math.random().toString(36).substring(2, 6).toUpperCase();
    }

    joinRoom(targetRoom, pName);
    
    // Update URL without full reload
    window.history.replaceState({}, "", `?room=${targetRoom}`);
  };

  const handleStart = async () => {
    if (players.length < 2) {
      setError("Need at least 2 players!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const wordPair = useGameStore.getState().popWordPair();
      startGame(wordPair);
    } catch {
      setError("Failed to fetch words. Using built-in pairs.");
      const fallback = {
        normalWord: "Eyelashes",
        imposterWord: "Eyebrows",
      };
      startGame(fallback);
    } finally {
      setLoading(false);
    }
  };

  // If already joined, show the lobby
  if (roomCode) {
    const iAmHost = players.find(p => p.name === myName)?.isHost;
    
    return (
      <div className={styles.container}>
        <div className={`${styles.header} animate-fadeUp`}>
          <div className={styles.logoWrap}>
            <span className={styles.logoIcon}>🕵️</span>
          </div>
          <h1 className={styles.title}>
            Lobby: <span className="gradient-text">{roomCode}</span>
          </h1>
          <p className={styles.subtitle}>
            Share link: {window.location.origin}/?room={roomCode}
          </p>
        </div>

        <div className={`${styles.card} glass-card animate-fadeUp stagger-2`}>
          <label className={styles.label}>Players in Lobby ({players.length}/10)</label>
          <div className={styles.tags}>
            {players.map((p, i) => (
              <div key={p.id || i} className={styles.tag}>
                <span className={styles.tagAvatar}>
                  {p.name.charAt(0).toUpperCase()}
                </span>
                <span>{p.name} {p.isHost && "👑"}</span>
              </div>
            ))}
          </div>
          {players.length < 2 && (
            <p className={styles.counter} style={{marginTop: 10, color: 'var(--text-dim)'}}>
              Waiting for more players...
            </p>
          )}
        </div>

        {error && <p className={`${styles.error} animate-fadeIn`}>{error}</p>}

        {iAmHost ? (
          <button
            className={`btn-primary ${styles.startBtn} animate-fadeUp stagger-4`}
            onClick={handleStart}
            disabled={loading || players.length < 2}
          >
            {loading ? (
              <span className={styles.loadingRow}>
                <span className={styles.spinner} /> Generating Words…
              </span>
            ) : (
              "🎮 Start Game"
            )}
          </button>
        ) : (
          <div className={`${styles.timerCard} animate-fadeUp stagger-4`} style={{textAlign: "center", padding: 20}}>
            <p>Waiting for host to start...</p>
          </div>
        )}
        
        <button 
          className="btn-secondary animate-fadeUp stagger-5" 
          onClick={leaveRoom}
          style={{ width: "100%", marginTop: "12px", border: "1px solid var(--accent-red)", color: "var(--accent-red)" }}
        >
          Leave Room
        </button>
      </div>
    );
  }

  // Initial Form
  return (
    <div className={styles.container}>
      <div className={`${styles.header} animate-fadeUp`}>
        <div className={styles.logoWrap}>
          <span className={styles.logoIcon}>🕵️</span>
        </div>
        <h1 className={styles.title}>
          Word <span className="gradient-text">Imposter</span>
        </h1>
        <p className={styles.subtitle}>
          One player gets a similar word — find the spy!
        </p>
      </div>

      <div className={`${styles.card} glass-card animate-fadeUp stagger-2`}>
        <label className={styles.label}>Your Name</label>
        <div className={styles.inputRow}>
          <input
            className="input-field"
            style={{ flex: 1 }}
            type="text"
            placeholder="Enter your name…"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            maxLength={15}
          />
        </div>
      </div>

      <div className={`${styles.card} glass-card animate-fadeUp stagger-3`}>
        <label className={styles.label}>Room Code (leave empty to create)</label>
        <div className={styles.inputRow}>
          <input
            className="input-field"
            style={{ flex: 1 }}
            type="text"
            placeholder="e.g. ABCD"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            maxLength={6}
          />
        </div>
      </div>

      {error && <p className={`${styles.error} animate-fadeIn`}>{error}</p>}

      <button
        className={`btn-primary ${styles.startBtn} animate-fadeUp stagger-4`}
        onClick={handleJoin}
      >
        {roomInput ? "🚪 Join Room" : "✨ Create New Room"}
      </button>

      <p className={`${styles.footer} animate-fadeUp stagger-5`}>
        Powered by NVIDIA AI
      </p>
    </div>
  );
}
