import type { Metadata } from "next"
import Heading from "@/components/ui/Heading"
import VotingBoard from "@/components/voting/VotingBoard"

export const metadata : Metadata = {
    title: "Votación · Antojo Gourmet",
}


export default function VotingPage () {

    return (

        <div className="space-y-6">

            <Heading>¿Cuántas ganas tenés?</Heading>

            <VotingBoard />

        </div>

    )

}
