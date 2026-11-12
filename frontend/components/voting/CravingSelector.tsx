import { CATEGORY_META, CRAVING_LEVEL_IDS, CRAVING_LEVEL_META, type categoryIdT, type cravingLevelT } from "@/src/constants"

type cravingSelectorProps = Readonly< {
    category: categoryIdT,
    value: cravingLevelT,
    onChange: ( level : cravingLevelT ) => void
} >

const LEVEL_STYLES : Record<cravingLevelT, string> = {
    POCAS: "bg-stone-500 text-white",
    MEDIAS: "bg-amber-500 text-stone-900",
    MUCHAS: "bg-red-700 text-white",
}


export default function CravingSelector ( { category, value, onChange } : cravingSelectorProps ) {

    const { label, emoji } = CATEGORY_META[category]

    return (

        <div className="flex items-center justify-between gap-2">

            <span className="text-sm font-semibold text-stone-700 whitespace-nowrap">
                <span aria-hidden>{emoji}</span> {label}
            </span>

            <div className="flex rounded-xl bg-stone-100 p-1" role="group" aria-label={`Ganas de ${label}`}>
                {
                    CRAVING_LEVEL_IDS.map( (level) => {

                        const isSelected = value === level

                        return (
                            <button
                                key={level}
                                type="button"
                                onClick={() => onChange( level )}
                                aria-pressed={isSelected}
                                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${isSelected ? LEVEL_STYLES[level] : "text-stone-500 hover:text-stone-900"}`}
                            >
                                {CRAVING_LEVEL_META[level].label}
                            </button>
                        )
                    } )
                }
            </div>

        </div>

    )

}
