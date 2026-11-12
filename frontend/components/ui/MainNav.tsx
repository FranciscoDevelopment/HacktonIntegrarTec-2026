"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const STEPS = [
    { href: "/", label: "Comensales" },
    { href: "/votacion", label: "Votación" },
    { href: "/resultado", label: "Resultado" },
] as const


export default function MainNav () {

    const pathname = usePathname()

    return (

        <header className="bg-red-800 text-amber-50">

            <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                <Link href="/" className="flex items-center gap-3">

                    <span className="text-4xl" aria-hidden>🍽️</span>

                    <span>
                        <span className="block text-2xl font-black leading-none">Antojo Gourmet</span>
                        <span className="block text-xs uppercase tracking-widest text-amber-200">
                            Feria de Soluciones Improbables
                        </span>
                    </span>

                </Link>

                <ol className="flex gap-2 text-sm">
                    {
                        STEPS.map( (step, index) => {

                            const isActive = pathname === step.href

                            return (
                                <li
                                    key={step.href}
                                    className={`rounded-full px-3 py-1 font-semibold ${isActive ? "bg-amber-50 text-red-800" : "bg-red-900/60 text-amber-100"}`}
                                    aria-current={isActive ? "step" : undefined}
                                >
                                    {index + 1}. {step.label}
                                </li>
                            )
                        } )
                    }
                </ol>

            </div>

        </header>

    )

}
