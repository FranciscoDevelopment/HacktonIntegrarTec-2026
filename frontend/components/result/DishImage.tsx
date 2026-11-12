import Image from "next/image"
import type { rankedDishT } from "@/src/schema"

type dishImageProps = Readonly< {
    dish: Pick<rankedDishT, "name" | "emoji" | "imageUrl">,
    className?: string,
    emojiClassName?: string,
    sizes: string
} >


// Foto de Wikipedia si hay; si no, el emoji del plato
export default function DishImage ( { dish, className = "", emojiClassName = "text-5xl", sizes } : dishImageProps ) {

    return (

        <div className={`relative overflow-hidden bg-amber-100 flex items-center justify-center ${className}`}>
            {
                dish.imageUrl
                    ? <Image src={dish.imageUrl} alt={dish.name} fill sizes={sizes} className="object-cover" unoptimized />
                    : <span className={emojiClassName} aria-hidden>{dish.emoji}</span>
            }
        </div>

    )

}
