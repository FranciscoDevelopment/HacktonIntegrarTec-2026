type childrenProps = Readonly< {children: React.ReactNode} >


export default function Heading ( {children} : childrenProps ) {

    return(

        <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight">{children}</h1>

    )
}
