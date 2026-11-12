import { z } from "zod"
import {
    CATEGORY_IDS,
    CRAVING_LEVEL_IDS,
    FOOD_STYLE_IDS,
    MAX_PARTICIPANTS,
    MIN_PARTICIPANTS,
} from "./constants"

export const CategoryIdSchema = z.enum( CATEGORY_IDS )

export const CravingLevelSchema = z.enum( CRAVING_LEVEL_IDS )

export const FoodStyleSchema = z.enum( FOOD_STYLE_IDS )


export const ParticipantNamesFormSchema = z
    .array( z.string().trim().max( 30, { error: "Cada nombre puede tener hasta 30 caracteres" } ) )
    .transform( (names) => names.filter( Boolean ) )
    .pipe(
        z.array( z.string() )
            .min( MIN_PARTICIPANTS, { error: `Cargá al menos ${MIN_PARTICIPANTS} comensales` } )
            .max( MAX_PARTICIPANTS, { error: `Como máximo pueden ser ${MAX_PARTICIPANTS} comensales` } )
            .refine(
                (names) => new Set( names.map( (name) => name.toLowerCase() ) ).size === names.length,
                { error: "Hay nombres repetidos" }
            )
    )


export const ClimateBonusSchema = z.object({
    style: FoodStyleSchema.nullable(),
    points: z.number(),
})

export const WeatherResponseSchema = z.object({
    temperature: z.number(),
    latitude: z.number(),
    longitude: z.number(),
    locationLabel: z.string(),
    isDefaultLocation: z.boolean(),
    observedAt: z.string(),
    climateBonus: ClimateBonusSchema,
})

export const RankedDishSchema = z.object({
    id: z.string(),
    name: z.string(),
    emoji: z.string(),
    categories: z.array( CategoryIdSchema ),
    style: FoodStyleSchema,
    imageUrl: z.string().nullable(),
    description: z.string().nullable(),
    sourceUrl: z.string().nullable(),
    position: z.number(),
    score: z.number(),
    categoriesAverage: z.number(),
    stylePoints: z.number(),
})

const StyleTotalSchema = z.object({
    votes: z.number(),
    climatePoints: z.number(),
    total: z.number(),
})

export const DecisionResponseSchema = z.object({
    winner: RankedDishSchema,
    ranking: z.array( RankedDishSchema ),
    categoryTotals: z.record( CategoryIdSchema, z.number() ),
    styleTotals: z.record( FoodStyleSchema, StyleTotalSchema ),
    weather: WeatherResponseSchema.nullable(),
    participantsCount: z.number(),
    decidedAt: z.string(),
})

// Así responde el filtro de errores del back
export const ErrorResponseSchema = z.object({
    statusCode: z.number(),
    message: z.union([
        z.string(),
        z.object({
            message: z.union([ z.string(), z.array( z.string() ) ]),
        }),
    ]),
})


export type weatherT = z.infer< typeof WeatherResponseSchema >

export type rankedDishT = z.infer< typeof RankedDishSchema >

export type decisionT = z.infer< typeof DecisionResponseSchema >
