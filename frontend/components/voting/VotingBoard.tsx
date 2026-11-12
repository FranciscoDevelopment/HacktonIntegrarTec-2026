"use client"

import { useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useShallow } from "zustand/react/shallow"
import { toast } from "react-toastify"
import { VOTING_DURATION_MS } from "@/src/constants"
import { useNowSeconds } from "@/src/hooks/use-now-seconds"
import { useAntojoStore } from "@/src/store-zustand/store-antojo-zustand"
import LoadingState from "../ui/LoadingState"
import Countdown from "./Countdown"
import ParticipantCard from "./ParticipantCard"
import WeatherBadge from "./WeatherBadge"


export default function VotingBoard () {

    const router = useRouter()

    const { hasHydrated, participants, votingStartedAt, decision, isDeciding, decide, requestLocation } = useAntojoStore(
        useShallow( (state) => ({
            hasHydrated: state.hasHydrated,
            participants: state.participants,
            votingStartedAt: state.votingStartedAt,
            decision: state.decision,
            isDeciding: state.isDeciding,
            decide: state.decide,
            requestLocation: state.requestLocation,
        }) )
    )

    const now = useNowSeconds()

    const remainingMs = votingStartedAt && now
        ? Math.max( 0, votingStartedAt + VOTING_DURATION_MS - now )
        : VOTING_DURATION_MS

    const isTimeUp = votingStartedAt !== null && now > 0 && remainingMs === 0

    const autoDecidedRef = useRef( false )


    const runDecision = useCallback( async () => {

        try {
            await decide()
        } catch ( error ) {
            toast.error( ( error as Error ).message )
        }

    }, [ decide ] )


    useEffect( () => {

        if( hasHydrated && !participants.length ) router.replace( "/" )

    }, [ hasHydrated, participants.length, router ] )


    useEffect( () => {

        if( decision ) router.push( "/resultado" )

    }, [ decision, router ] )


    useEffect( () => {

        requestLocation()

    }, [ requestLocation ] )


    // Si el reloj llega a cero, decide solo, una única vez
    useEffect( () => {

        if( !isTimeUp || autoDecidedRef.current || decision || isDeciding ) return

        autoDecidedRef.current = true

        toast.info( "¡Se acabó el tiempo! Decide Antojo Gourmet" )

        void runDecision()

    }, [ isTimeUp, decision, isDeciding, runDecision ] )


    if( !hasHydrated || !participants.length ) return <LoadingState />


    return (

        <section className="space-y-6">

            <div className="grid gap-4 md:grid-cols-2">
                <Countdown remainingMs={remainingMs} />
                <WeatherBadge />
            </div>

            <p className="text-stone-600">
                Cada comensal marca sus ganas y elige fitness o contundente. Todo arranca en <strong>medias</strong>: cambiá solo lo que importa.
            </p>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {
                    participants.map( (participant) => (
                        <ParticipantCard key={participant.id} participant={participant} />
                    ) )
                }
            </div>

            <div className="sticky bottom-4">
                <button
                    type="button"
                    onClick={() => void runDecision()}
                    disabled={isDeciding}
                    className="w-full rounded-2xl bg-red-700 px-6 py-4 text-lg font-black text-white shadow-lg hover:bg-red-800 disabled:cursor-wait disabled:bg-stone-500 transition-colors"
                >
                    {isDeciding ? "Consultando al clima y a la carta..." : "Decidir ahora"}
                </button>
            </div>

        </section>

    )

}
