import { ErrorResponseSchema } from "./schema"

const pointsFormat = new Intl.NumberFormat( "es-AR", { maximumFractionDigits: 2 } )

const temperatureFormat = new Intl.NumberFormat( "es-AR", { maximumFractionDigits: 1 } )


export function formatPoints ( points : number ) {

    return pointsFormat.format( points )

}

export function formatTemperature ( temperature : number ) {

    return `${temperatureFormat.format( temperature )} °C`

}

export function formatCountdown ( milliseconds : number ) {

    const totalSeconds = Math.max( 0, Math.ceil( milliseconds / 1000 ) )

    const minutes = Math.floor( totalSeconds / 60 )

    const seconds = totalSeconds % 60

    return `${String( minutes ).padStart( 2, "0" )}:${String( seconds ).padStart( 2, "0" )}`

}

export function getErrorMessage ( data : unknown, fallback = "Algo salió mal, probá de nuevo" ) {

    const result = ErrorResponseSchema.safeParse( data )

    if( !result.success ) return fallback

    const { message } = result.data

    if( typeof message === "string" ) return message

    return Array.isArray( message.message ) ? message.message.join( ". " ) : message.message

}
