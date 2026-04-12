"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useGameStore } from "@/lib/gameStore"

import SetupScreen from "@/components/SetupScreen"
import DiscussScreen from "@/components/DiscussScreen"
import VoteScreen from "@/components/VoteScreen"
import ResultScreen from "@/components/ResultScreen"

function AppRouter() {
  const { phase } = useGameStore()
  const searchParams = useSearchParams()
  const room = searchParams.get("room") || ""

  return (
    <>
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
