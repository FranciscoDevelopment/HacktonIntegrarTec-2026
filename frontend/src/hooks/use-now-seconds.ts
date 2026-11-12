import { useSyncExternalStore } from "react"

function subscribe ( onTick : () => void ) {

    const intervalId = setInterval( onTick, 1000 )

    return () => clearInterval( intervalId )

}

// Redondeado al segundo para que el valor sea estable entre renders del mismo segundo
const getSnapshot = () => Math.floor( Date.now() / 1000 ) * 1000

const getServerSnapshot = () => 0


// Hora actual que se actualiza cada segundo; en el servidor vale 0
export function useNowSeconds () {

    return useSyncExternalStore( subscribe, getSnapshot, getServerSnapshot )

}
