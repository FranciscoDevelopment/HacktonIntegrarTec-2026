import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import MainNav from "@/components/ui/MainNav"
import StoreHydration from "@/components/ui/StoreHydration"
import ToastNotification from "@/components/ui/ToastNotification"
import "./globals.css"

const outfit = Outfit( { subsets: ["latin"] } )


export const metadata : Metadata = {
    title: "Antojo Gourmet",
    description: "Cinco o seis personas, cuarenta minutos y nadie sabe qué pedir. Antojo Gourmet lo resuelve con votos y con el clima.",
}

export default function RootLayout ( { children } : LayoutProps<"/"> ) {

    return (

        <html lang="es">
            <body className={`${outfit.className} min-h-screen bg-amber-50 text-stone-900 antialiased`}>

                <MainNav />

                <main className="mx-auto max-w-6xl px-4 py-8">
                    {children}
                </main>

                <StoreHydration />

                <ToastNotification />

            </body>
        </html>

    )

}
