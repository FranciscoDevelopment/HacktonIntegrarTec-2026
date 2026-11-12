import type { Metadata } from "next"
import DecisionResult from "@/components/result/DecisionResult"
import Heading from "@/components/ui/Heading"

export const metadata : Metadata = {
    title: "Resultado · Antojo Gourmet",
}


export default function ResultPage () {

    return (

        <div className="space-y-6">

            <Heading>Veredicto de la mesa</Heading>

            <DecisionResult />

        </div>

    )

}
