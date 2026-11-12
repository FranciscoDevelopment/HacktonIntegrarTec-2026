const API_URL = process.env.API_URL ?? "http://localhost:3001"

export async function POST ( request : Request ) {

    const body = await request.json()

    try {

        const response = await fetch( `${API_URL}/decision`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( body ),
        } )

        const data = await response.json()

        return Response.json( data, { status: response.status } )

    } catch {

        return Response.json(
            { statusCode: 503, message: "El servidor de Antojo Gourmet no responde. ¿Está levantado el back?" },
            { status: 503 }
        )
    }

}
