export const MIN_PARTICIPANTS = 5

export const MAX_PARTICIPANTS = 6

// La votación dura como máximo 40 minutos: lo que tarda un grupo en no decidir nada
export const VOTING_DURATION_MS = 40 * 60 * 1000

// Los nombres (y la ronda en curso) se guardan en el navegador hasta 60 minutos
export const SESSION_TTL_MS = 60 * 60 * 1000

export const CATEGORY_IDS = [
    "SALADO",
    "DULCE",
    "VEGETARIANO",
    "VEGANO",
    "CARNIVORO",
    "HARINAS",
] as const

export const CRAVING_LEVEL_IDS = [ "POCAS", "MEDIAS", "MUCHAS" ] as const

export const FOOD_STYLE_IDS = [ "FITNESS", "CONTUNDENTE" ] as const

export type categoryIdT = typeof CATEGORY_IDS[number]

export type cravingLevelT = typeof CRAVING_LEVEL_IDS[number]

export type foodStyleT = typeof FOOD_STYLE_IDS[number]

export const DEFAULT_CRAVING : cravingLevelT = "MEDIAS"

export const CATEGORY_META : Record<categoryIdT, { label: string, emoji: string }> = {
    SALADO: { label: "Salado", emoji: "🧂" },
    DULCE: { label: "Dulce", emoji: "🍰" },
    VEGETARIANO: { label: "Vegetariano", emoji: "🥦" },
    VEGANO: { label: "Vegano", emoji: "🌱" },
    CARNIVORO: { label: "Carnívoro", emoji: "🥩" },
    HARINAS: { label: "De harinas", emoji: "🥖" },
}

export const CRAVING_LEVEL_META : Record<cravingLevelT, { label: string, points: number }> = {
    POCAS: { label: "Pocas", points: 1 },
    MEDIAS: { label: "Medias", points: 2 },
    MUCHAS: { label: "Muchas", points: 3 },
}

export const FOOD_STYLE_META : Record<foodStyleT, { label: string, emoji: string, hint: string }> = {
    FITNESS: { label: "Fitness", emoji: "🥗", hint: "Liviano" },
    CONTUNDENTE: { label: "Contundente", emoji: "🍖", hint: "Te deja tirado en el sillón" },
}
