"use client"

import { useShallow } from "zustand/react/shallow"
import { FOOD_STYLE_META } from "@/src/constants"
import { useAntojoStore } from "@/src/store-zustand/store-antojo-zustand"
import { formatPoints, formatTemperature } from "@/src/utils"


export default function WeatherBadge () {

    const { weather, weatherError, locationStatus } = useAntojoStore(
        useShallow( (state) => ({
            weather: state.weather,
            weatherError: state.weatherError,
            locationStatus: state.locationStatus,
        }) )
    )

    let content : React.ReactNode

    if( weather ) {

        const { climateBonus } = weather

        content = (
            <>
                <p className="text-4xl font-black text-stone-900">{formatTemperature( weather.temperature )}</p>
                <p className="text-sm text-stone-500">en {weather.locationLabel}</p>
                <p className="mt-2 font-semibold text-stone-800">
                    {
                        climateBonus.style
                            ? <>El clima vota {FOOD_STYLE_META[climateBonus.style].emoji} {FOOD_STYLE_META[climateBonus.style].label} <span className="text-red-700">+{formatPoints( climateBonus.points )}</span></>
                            : "Hace 20 °C justos: el clima no opina"
                    }
                </p>
            </>
        )

    } else if( weatherError ) {

        content = <p className="text-stone-600">No pudimos consultar el clima. Se decide igual, sin su voto.</p>

    } else {

        content = (
            <p className="text-stone-500 animate-pulse">
                {locationStatus === "pending" ? "Esperando permiso para ver tu ubicación..." : "Mirando por la ventana..."}
            </p>
        )
    }

    return (

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">

            <p className="text-xs uppercase tracking-widest text-stone-500">🌡️ El voto del clima</p>

            <div className="mt-1">{content}</div>

        </div>

    )

}
