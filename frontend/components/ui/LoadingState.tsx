type loadingStateProps = Readonly< { message?: string } >


export default function LoadingState ( { message = "Prendiendo la parrilla..." } : loadingStateProps ) {

    return (

        <p className="py-20 text-center text-lg text-stone-500 animate-pulse">{message}</p>

    )

}
