import { CATEGORY_META, FOOD_STYLE_META } from "@/src/constants"
import type { rankedDishT } from "@/src/schema"
import { formatPoints } from "@/src/utils"
import DishImage from "./DishImage"

type rankingTableProps = Readonly< { ranking: rankedDishT[] } >

const PODIUM = [ "🥇", "🥈", "🥉" ]

const VISIBLE_DISHES = 10


function RankingRow ( { dish } : Readonly< { dish: rankedDishT } > ) {

    return (

        <li className="flex items-center gap-3 py-3">

            <span className="w-8 text-center text-lg font-black text-stone-500">
                {PODIUM[dish.position - 1] ?? dish.position}
            </span>

            <DishImage dish={dish} sizes="56px" className="h-14 w-14 shrink-0 rounded-xl" emojiClassName="text-2xl" />

            <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-stone-900">{dish.name}</p>
                <p className="truncate text-xs text-stone-500">
                    {dish.categories.map( (category) => CATEGORY_META[category].label ).join( " · " )}
                    {" · "}{FOOD_STYLE_META[dish.style].emoji} {FOOD_STYLE_META[dish.style].label}
                </p>
            </div>

            <div className="text-right">
                <p className="text-xl font-black text-red-700">{formatPoints( dish.score )}</p>
                <p className="text-xs text-stone-500 whitespace-nowrap">
                    {formatPoints( dish.categoriesAverage )} + {formatPoints( dish.stylePoints )}
                </p>
            </div>

        </li>

    )

}


export default function RankingTable ( { ranking } : rankingTableProps ) {

    const visible = ranking.slice( 0, VISIBLE_DISHES )

    const rest = ranking.slice( VISIBLE_DISHES )

    return (

        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">

            <h3 className="text-xl font-black text-stone-900">Tabla de posiciones</h3>

            <p className="text-sm text-stone-500">Puntaje = promedio de ganas de sus categorías + puntos de su estilo</p>

            <ol className="mt-2 divide-y divide-stone-100">
                {visible.map( (dish) => <RankingRow key={dish.id} dish={dish} /> )}
            </ol>

            {
                rest.length > 0 && (
                    <details className="mt-2">
                        <summary className="cursor-pointer font-semibold text-red-700">Ver el resto de la carta ({rest.length})</summary>
                        <ol className="divide-y divide-stone-100">
                            {rest.map( (dish) => <RankingRow key={dish.id} dish={dish} /> )}
                        </ol>
                    </details>
                )
            }

        </section>

    )

}
