"use client"

import { CATEGORY_IDS, DEFAULT_CRAVING, FOOD_STYLE_IDS, FOOD_STYLE_META } from "@/src/constants"
import { useAntojoStore, type participantT } from "@/src/store-zustand/store-antojo-zustand"
import CravingSelector from "./CravingSelector"

type participantCardProps = Readonly< { participant: participantT } >


export default function ParticipantCard ( { participant } : participantCardProps ) {

    const vote = useAntojoStore( (state) => state.votes[participant.id] )

    const setCraving = useAntojoStore( (state) => state.setCraving )

    const toggleStyle = useAntojoStore( (state) => state.toggleStyle )

    return (

        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200 space-y-4">

            <h3 className="text-lg font-black text-stone-900 truncate">🙋 {participant.name}</h3>

            <div className="space-y-2">
                {
                    CATEGORY_IDS.map( (category) => (
                        <CravingSelector
                            key={category}
                            category={category}
                            value={vote?.cravings[category] ?? DEFAULT_CRAVING}
                            onChange={( level ) => setCraving( participant.id, category, level )}
                        />
                    ) )
                }
            </div>

            <div>
                <p className="mb-2 text-xs uppercase tracking-widest text-stone-500">¿Fitness o contundente?</p>
                <div className="grid grid-cols-2 gap-2">
                    {
                        FOOD_STYLE_IDS.map( (style) => {

                            const isSelected = vote?.style === style

                            const { label, emoji, hint } = FOOD_STYLE_META[style]

                            return (
                                <button
                                    key={style}
                                    type="button"
                                    onClick={() => toggleStyle( participant.id, style )}
                                    aria-pressed={isSelected}
                                    title={hint}
                                    className={`rounded-xl border-2 px-3 py-2 text-sm font-bold transition-colors ${isSelected ? "border-red-700 bg-red-700 text-white" : "border-stone-200 text-stone-700 hover:border-red-300"}`}
                                >
                                    {emoji} {label}
                                </button>
                            )
                        } )
                    }
                </div>
            </div>

        </article>

    )

}
