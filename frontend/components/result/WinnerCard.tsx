import { FOOD_STYLE_META } from "@/src/constants"
import type { decisionT } from "@/src/schema"
import { formatPoints } from "@/src/utils"
import DishImage from "./DishImage"

type winnerCardProps = Readonly< { decision: decisionT } >


export default function WinnerCard ( { decision } : winnerCardProps ) {

    const { winner, ranking } = decision

    const tiedDishes = ranking.filter( (dish) => dish.score === winner.score ).length

    return (

        <article className="overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-stone-200 md:grid md:grid-cols-2">

            <DishImage dish={winner} sizes="(min-width: 768px) 50vw, 100vw" className="h-64 md:h-full" emojiClassName="text-9xl" />

            <div className="p-6 md:p-8 space-y-4">

                <p className="text-xs font-bold uppercase tracking-widest text-red-700">Se pide</p>

                <h2 className="text-4xl font-black text-stone-900">{winner.emoji} {winner.name}</h2>

                <p className="text-lg text-stone-700">
                    <span className="text-3xl font-black text-red-700">{formatPoints( winner.score )}</span> puntos
                    {" "}= {formatPoints( winner.categoriesAverage )} de ganas + {formatPoints( winner.stylePoints )} de {FOOD_STYLE_META[winner.style].label.toLowerCase()}
                </p>

                {
                    tiedDishes > 1 && (
                        <p className="rounded-xl bg-amber-100 px-3 py-2 text-sm text-stone-700">
                            Empataron {tiedDishes} platos con {formatPoints( winner.score )} puntos. Desempató el orden alfabético.
                        </p>
                    )
                }

                {
                    winner.description && (
                        <p className="text-sm text-stone-500">
                            {winner.description}
                            {
                                winner.sourceUrl && (
                                    <> <a href={winner.sourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-red-700">Wikipedia</a></>
                                )
                            }
                        </p>
                    )
                }

            </div>

        </article>

    )

}
