"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useGameStore } from "@/lib/gameStore"

import SetupScreen from "@/components/SetupScreen"
import DiscussScreen from "@/components/DiscussScreen"
import VoteScreen from "@/components/VoteScreen"
import ResultScreen from "@/components/ResultScreen"

function AppRouter() {
  const { phase, roomCode, myName, channel, joinRoom, leaveRoom } = useGameStore()
  const searchParams = useSearchParams()
  const room = searchParams.get("room") || ""

  useEffect(() => {
    if (roomCode && myName && !channel) {
      // Reconnect if we have a saved session but no active channel
      joinRoom(roomCode, myName)
    }
  }, [roomCode, myName, channel, joinRoom])

  return (
    <>
      {roomCode && phase !== "result" && phase !== "setup" && (
        <button
          onClick={leaveRoom}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "0.8rem",
            fontWeight: "bold",
            cursor: "pointer",
            zIndex: 50,
          }}
        >
          Leave
        </button>
      )}
      {phase === "setup" && <SetupScreen initialRoom={room} />}
      {phase === "discuss" && <DiscussScreen />}
      {phase === "vote" && <VoteScreen />}
      {phase === "result" && <ResultScreen />}
    </>
  )
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
         <AppRouter />
      </Suspense>
    </main>
  )
}
