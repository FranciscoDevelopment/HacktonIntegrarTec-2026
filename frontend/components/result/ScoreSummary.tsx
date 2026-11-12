import { CATEGORY_IDS, CATEGORY_META, CRAVING_LEVEL_META, FOOD_STYLE_IDS, FOOD_STYLE_META } from "@/src/constants"
import type { decisionT } from "@/src/schema"
import { formatPoints, formatTemperature } from "@/src/utils"

type scoreSummaryProps = Readonly< { decision: decisionT } >


export default function ScoreSummary ( { decision } : scoreSummaryProps ) {

    const { weather, styleTotals, categoryTotals, participantsCount } = decision

    const maxCategoryPoints = participantsCount * CRAVING_LEVEL_META.MUCHAS.points

    return (

        <section className="grid gap-4 lg:grid-cols-3">

            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
                <h3 className="text-xs uppercase tracking-widest text-stone-500">🌡️ El voto del clima (automático por razones climáticas)</h3>
                {
                    weather
                        ? (
                            <div className="mt-2 space-y-1">
                                <p className="text-3xl font-black text-stone-900">{formatTemperature( weather.temperature )}</p>
                                <p className="text-sm text-stone-500">en {weather.locationLabel}</p>
                                <p className="font-semibold text-stone-800">
                                    {
                                        weather.climateBonus.style
                                            ? `${FOOD_STYLE_META[weather.climateBonus.style].label} +${formatPoints( weather.climateBonus.points )}`
                                            : "No opinó: hacía 20 °C justos"
                                    }
                                </p>
                            </div>
                        )
                        : <p className="mt-2 text-stone-600">No se pudo consultar el clima: se decidió sin su voto.</p>
                }
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
                <h3 className="text-xs uppercase tracking-widest text-stone-500">Fitness o contundente</h3>
                <ul className="mt-2 space-y-2">
                    {
                        FOOD_STYLE_IDS.map( (style) => {

                            const total = styleTotals[style]

                            return (
                                <li key={style} className="flex items-baseline justify-between gap-2">
                                    <span className="font-semibold text-stone-800">{FOOD_STYLE_META[style].emoji} {FOOD_STYLE_META[style].label}</span>
                                    <span className="text-sm text-stone-500">
                                        {total.votes} {total.votes === 1 ? "voto" : "votos"}
                                        {total.climatePoints > 0 && ` + ${formatPoints( total.climatePoints )} del clima`}
                                        {" = "}<strong className="text-stone-900">{formatPoints( total.total )}</strong>
                                    </span>
                                </li>
                            )
                        } )
                    }
                </ul>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
                <h3 className="text-xs uppercase tracking-widest text-stone-500">Ganas de la mesa</h3>
                <ul className="mt-2 space-y-1.5">
                    {
                        CATEGORY_IDS.map( (category) => (
                            <li key={category} className="text-sm">
                                <div className="flex justify-between text-stone-700">
                                    <span>{CATEGORY_META[category].emoji} {CATEGORY_META[category].label}</span>
                                    <strong>{categoryTotals[category]}</strong>
                                </div>
                                <div className="h-1.5 rounded-full bg-stone-100">
                                    <div
                                        className="h-full rounded-full bg-red-700"
                                        style={{ width: `${( categoryTotals[category] / maxCategoryPoints ) * 100}%` }}
                                    />
                                </div>
                            </li>
                        ) )
                    }
                </ul>
            </div>

        </section>

    )

}
