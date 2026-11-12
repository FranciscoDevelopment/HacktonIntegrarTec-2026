"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useShallow } from "zustand/react/shallow"
import { useAntojoStore } from "@/src/store-zustand/store-antojo-zustand"
import LoadingState from "../ui/LoadingState"
import RankingTable from "./RankingTable"
import ScoreSummary from "./ScoreSummary"
import WinnerCard from "./WinnerCard"


export default function DecisionResult () {

    const router = useRouter()

    const { hasHydrated, decision, hasParticipants, newRound } = useAntojoStore(
        useShallow( (state) => ({
            hasHydrated: state.hasHydrated,
            decision: state.decision,
            hasParticipants: state.participants.length > 0,
            newRound: state.newRound,
        }) )
    )

    useEffect( () => {

        if( hasHydrated && !decision ) router.replace( hasParticipants ? "/votacion" : "/" )

    }, [ hasHydrated, decision, hasParticipants, router ] )


    if( !hasHydrated || !decision ) return <LoadingState />


    const handleNewRound = () => {

        newRound()

        router.push( "/votacion" )

    }

    return (

        <section className="space-y-6">

            <WinnerCard decision={decision} />

            <ScoreSummary decision={decision} />

            <RankingTable ranking={decision.ranking} />

            <div className="grid gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={handleNewRound}
                    className="rounded-2xl bg-red-700 px-6 py-4 text-lg font-black text-white shadow hover:bg-red-800 transition-colors"
                >
                    Otra ronda con la misma mesa
                </button>
                <Link
                    href="/"
                    className="rounded-2xl bg-stone-900 px-6 py-4 text-center text-lg font-black text-amber-50 shadow hover:bg-stone-700 transition-colors"
                >
                    Cambiar comensales
                </Link>
            </div>

        </section>

    )

}
