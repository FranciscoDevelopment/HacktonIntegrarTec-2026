"use client"

import { useEffect } from "react"
import { toast } from "react-toastify"
import { SESSION_TTL_MS } from "@/src/constants"
import { useAntojoStore } from "@/src/store-zustand/store-antojo-zustand"


// Recupera la ronda guardada en el navegador y la borra cuando pasan los 60 minutos
export default function StoreHydration () {

    const sessionStartedAt = useAntojoStore( (state) => state.sessionStartedAt )

    useEffect( () => {

        Promise.resolve( useAntojoStore.persist.rehydrate() )
            .finally( () => useAntojoStore.getState().setHydrated() )

    }, [] )


    useEffect( () => {

        if( sessionStartedAt === null ) return

        const remaining = Math.max( 0, sessionStartedAt + SESSION_TTL_MS - Date.now() )

        const timeoutId = setTimeout( () => {

            useAntojoStore.getState().clearSession()

            toast.info( "Pasaron 60 minutos: se borraron los comensales guardados" )

        }, remaining )

        return () => clearTimeout( timeoutId )

    }, [ sessionStartedAt ] )


    return null

}
