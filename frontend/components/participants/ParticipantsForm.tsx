"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useShallow } from "zustand/react/shallow"
import { toast } from "react-toastify"
import { MAX_PARTICIPANTS, MIN_PARTICIPANTS } from "@/src/constants"
import { ParticipantNamesFormSchema } from "@/src/schema"
import { useAntojoStore } from "@/src/store-zustand/store-antojo-zustand"
import LoadingState from "../ui/LoadingState"

const SLOTS = Array.from( { length: MAX_PARTICIPANTS }, (_, index) => index )


export default function ParticipantsForm () {

    const router = useRouter()

    const { hasHydrated, participants, votingStartedAt, decision, startSession } = useAntojoStore(
        useShallow( (state) => ({
            hasHydrated: state.hasHydrated,
            participants: state.participants,
            votingStartedAt: state.votingStartedAt,
            decision: state.decision,
            startSession: state.startSession,
        }) )
    )

    if( !hasHydrated ) return <LoadingState />


    const handleSubmit = ( event : React.FormEvent<HTMLFormElement> ) => {

        event.preventDefault()

        const names = new FormData( event.currentTarget ).getAll( "names" ).map( String )

        const result = ParticipantNamesFormSchema.safeParse( names )

        if( !result.success ) {

            result.error.issues.forEach( (issue) => toast.error( issue.message ) )

            return
        }

        startSession( result.data )

        router.push( "/votacion" )

    }

    const hasRoundInProgress = participants.length > 0 && votingStartedAt !== null


    return (

        <section className="space-y-6">

            {
                hasRoundInProgress && (
                    <div className="rounded-2xl border border-amber-300 bg-amber-100 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-stone-800">
                            {decision ? "Ya hay un plato elegido para esta mesa." : "Hay una votación en curso con esta mesa."}
                        </p>
                        <Link
                            href={decision ? "/resultado" : "/votacion"}
                            className="rounded-xl bg-stone-900 px-4 py-2 text-center font-bold text-amber-50 hover:bg-stone-700"
                        >
                            {decision ? "Ver el resultado" : "Seguir votando"}
                        </Link>
                    </div>
                )
            }

            <form
                key={participants.map( (participant) => participant.id ).join( "-" )}
                onSubmit={handleSubmit}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200 space-y-5"
                noValidate
            >

                <div>
                    <h2 className="text-xl font-bold text-stone-900">¿Quiénes comen hoy?</h2>
                    <p className="text-sm text-stone-500">
                        Entre {MIN_PARTICIPANTS} y {MAX_PARTICIPANTS} comensales. Los nombres quedan guardados en este navegador por 60 minutos.
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    {
                        SLOTS.map( (slot) => (
                            <label key={slot} className="block">
                                <span className="text-sm font-semibold text-stone-600">
                                    Comensal {slot + 1}{slot >= MIN_PARTICIPANTS && " (opcional)"}
                                </span>
                                <input
                                    name="names"
                                    defaultValue={participants[slot]?.name ?? ""}
                                    maxLength={30}
                                    autoComplete="off"
                                    placeholder={slot >= MIN_PARTICIPANTS ? "El que siempre llega tarde" : "Nombre"}
                                    className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-200"
                                />
                            </label>
                        ) )
                    }
                </div>

                <button
                    type="submit"
                    className="w-full rounded-2xl bg-red-700 px-6 py-4 text-lg font-black text-white shadow hover:bg-red-800 transition-colors"
                >
                    Empezar la votación · 40 minutos
                </button>

            </form>

        </section>

    )

}
