import type { NextRequest } from "next/server"

const API_URL = process.env.API_URL ?? "http://localhost:3001"

export async function GET ( request : NextRequest ) {

    const params = new URLSearchParams()

    const latitude = request.nextUrl.searchParams.get( "latitude" )

    const longitude = request.nextUrl.searchParams.get( "longitude" )

    if( latitude && longitude ) {
        params.set( "latitude", latitude )
        params.set( "longitude", longitude )
    }

    const query = params.size ? `?${params}` : ""

    try {

        const response = await fetch( `${API_URL}/weather${query}`, { cache: "no-store" } )

        const data = await response.json()

        return Response.json( data, { status: response.status } )

    } catch {

        return Response.json(
            { statusCode: 503, message: "El servidor de Antojo Gourmet no responde. ¿Está levantado el back?" },
            { status: 503 }
        )
    }

}
