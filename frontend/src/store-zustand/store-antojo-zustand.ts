import { create } from "zustand"
import { createJSONStorage, devtools, persist, type StateStorage } from "zustand/middleware"
import {
    CATEGORY_IDS,
    DEFAULT_CRAVING,
    SESSION_TTL_MS,
    type categoryIdT,
    type cravingLevelT,
    type foodStyleT,
} from "../constants"
import { DecisionResponseSchema, WeatherResponseSchema, type decisionT, type weatherT } from "../schema"
import { getErrorMessage } from "../utils"

export type participantT = {
    id: string,
    name: string
}

export type voteT = {
    cravings: Record<categoryIdT, cravingLevelT>,
    style: foodStyleT | null
}

type locationT = {
    latitude: number,
    longitude: number
}

type locationStatusT = "idle" | "pending" | "granted" | "denied"

type antojoStoreT = {

    participants: participantT[],

    votes: Record<participantT["id"], voteT>,

    // Desde cuándo están guardados los nombres (vencen a los 60 minutos)
    sessionStartedAt: number | null,

    // Arranque del reloj de 40 minutos
    votingStartedAt: number | null,

    decision: decisionT | null,

    isDeciding: boolean,

    location: locationT | null,

    locationStatus: locationStatusT,

    weather: weatherT | null,

    weatherError: boolean,

    hasHydrated: boolean,

    startSession: ( names : string[] ) => void,

    setCraving: ( participantId : string, category : categoryIdT, level : cravingLevelT ) => void,

    toggleStyle: ( participantId : string, style : foodStyleT ) => void,

    decide: () => Promise<void>,

    newRound: () => void,

    clearSession: () => void,

    requestLocation: () => void,

    fetchWeather: () => Promise<void>,

    setHydrated: () => void
}

type persistedStateT = Pick<antojoStoreT, "participants" | "votes" | "sessionStartedAt" | "votingStartedAt" | "decision">

const STORAGE_NAME = "antojo-gourmet"


const initialSessionState : persistedStateT = {
    participants: [],
    votes: {},
    sessionStartedAt: null,
    votingStartedAt: null,
    decision: null,
}


export function isSessionExpired ( sessionStartedAt : number | null ) {

    return sessionStartedAt !== null && Date.now() - sessionStartedAt > SESSION_TTL_MS

}


function createDefaultVote () : voteT {

    const cravings = Object.fromEntries(
        CATEGORY_IDS.map( (category) => [ category, DEFAULT_CRAVING ] )
    ) as voteT["cravings"]

    return { cravings, style: null }

}

function createDefaultVotes ( participants : participantT[] ) {

    return Object.fromEntries(
        participants.map( (participant) => [ participant.id, createDefaultVote() ] )
    )

}


// localStorage que descarta lo guardado cuando pasaron más de 60 minutos
const expiringLocalStorage : StateStorage = {

    getItem: ( name ) => {

        try {

            const stored = localStorage.getItem( name )

            if( !stored ) return null

            const { state } = JSON.parse( stored ) as { state?: Partial<persistedStateT> }

            if( isSessionExpired( state?.sessionStartedAt ?? null ) ) {

                localStorage.removeItem( name )

                return null
            }

            return stored

        } catch {

            return null
        }

    },

    setItem: ( name, value ) => {

        try { localStorage.setItem( name, value ) } catch { /* sin almacenamiento, sigue en memoria */ }

    },

    removeItem: ( name ) => {

        try { localStorage.removeItem( name ) } catch { /* nada que borrar */ }

    },
}


export const useAntojoStore = create<antojoStoreT>()( devtools( persist( ( set, get ) => {

    return {

        ...initialSessionState,

        isDeciding: false,

        location: null,

        locationStatus: "idle",

        weather: null,

        weatherError: false,

        hasHydrated: false,

        startSession: ( names ) => {

            const participants = names.map( (name) => ({ id: crypto.randomUUID(), name }) )

            const now = Date.now()

            set( () => ({
                participants,
                votes: createDefaultVotes( participants ),
                sessionStartedAt: now,
                votingStartedAt: now,
                decision: null,
            }) )

        },

        setCraving: ( participantId, category, level ) => {

            const vote = get().votes[participantId] ?? createDefaultVote()

            set( (state) => ({
                votes: {
                    ...state.votes,
                    [participantId]: { ...vote, cravings: { ...vote.cravings, [category]: level } }
                }
            }) )

        },

        toggleStyle: ( participantId, style ) => {

            const vote = get().votes[participantId] ?? createDefaultVote()

            set( (state) => ({
                votes: {
                    ...state.votes,
                    // Tocar el mismo estilo otra vez lo deselecciona
                    [participantId]: { ...vote, style: vote.style === style ? null : style }
                }
            }) )

        },

        decide: async () => {

            if( get().isDeciding ) return

            const { participants, votes, location } = get()

            set( () => ({ isDeciding: true }) )

            try {

                const request = await fetch( "/api/decision", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        participants: participants.map( (participant) => {

                            const vote = votes[participant.id] ?? createDefaultVote()

                            return { name: participant.name, cravings: vote.cravings, style: vote.style }
                        } ),
                        ...location
                    })
                } )

                const data = await request.json()

                if( !request.ok ) throw new Error( getErrorMessage( data ) )

                set( () => ({ decision: DecisionResponseSchema.parse( data ) }) )

            } finally {

                set( () => ({ isDeciding: false }) )
            }

        },

        newRound: () => {

            set( (state) => ({
                votes: createDefaultVotes( state.participants ),
                votingStartedAt: Date.now(),
                decision: null,
            }) )

        },

        clearSession: () => {

            set( () => ({ ...initialSessionState }) )

        },

        requestLocation: () => {

            if( get().locationStatus !== "idle" ) return

            if( !( "geolocation" in navigator ) ) {

                set( () => ({ locationStatus: "denied" }) )

                void get().fetchWeather()

                return
            }

            set( () => ({ locationStatus: "pending" }) )

            navigator.geolocation.getCurrentPosition(
                ( position ) => {

                    set( () => ({
                        locationStatus: "granted",
                        location: { latitude: position.coords.latitude, longitude: position.coords.longitude }
                    }) )

                    void get().fetchWeather()
                },
                () => {

                    // Sin permiso, el back usa Buenos Aires
                    set( () => ({ locationStatus: "denied" }) )

                    void get().fetchWeather()
                },
                { timeout: 8000, maximumAge: 10 * 60 * 1000 }
            )

        },

        fetchWeather: async () => {

            const location = get().location

            const params = location
                ? `?${new URLSearchParams({ latitude: String( location.latitude ), longitude: String( location.longitude ) })}`
                : ""

            try {

                const request = await fetch( `/api/weather${params}` )

                const data = await request.json()

                if( !request.ok ) throw new Error( getErrorMessage( data ) )

                set( () => ({ weather: WeatherResponseSchema.parse( data ), weatherError: false }) )

            } catch {

                set( () => ({ weatherError: true }) )
            }

        },

        setHydrated: () => {

            set( () => ({ hasHydrated: true }) )

        },

    }

}, {
    name: STORAGE_NAME,
    storage: createJSONStorage( () => expiringLocalStorage ),
    // Solo se guarda la ronda; ubicación, clima y estados de carga quedan en memoria
    partialize: ( state ) : persistedStateT => ({
        participants: state.participants,
        votes: state.votes,
        sessionStartedAt: state.sessionStartedAt,
        votingStartedAt: state.votingStartedAt,
        decision: state.decision,
    }),
    // Se rehidrata a mano en StoreHydration para no romper el render del servidor
    skipHydration: true,
} ) ) )
