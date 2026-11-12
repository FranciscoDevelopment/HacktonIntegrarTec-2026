import ParticipantsForm from "@/components/participants/ParticipantsForm"
import Heading from "@/components/ui/Heading"


export default function HomePage () {

    return (

        <div className="space-y-6">

            <div className="space-y-2">
                <Heading>¿Qué pedimos?</Heading>
                <p className="max-w-2xl text-stone-600">
                    Cinco o seis personas, cuarenta minutos y nadie se decide. Cada uno vota sus ganas, el clima mete su opinión
                    y Antojo Gourmet arma la tabla de posiciones de la comida argentina.
                </p>
            </div>

            <ParticipantsForm />

        </div>

    )

}
