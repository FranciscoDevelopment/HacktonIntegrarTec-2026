import { VOTING_DURATION_MS } from "@/src/constants"
import { formatCountdown } from "@/src/utils"

type countdownProps = Readonly< { remainingMs: number } >

const WARNING_MS = 5 * 60 * 1000


export default function Countdown ( { remainingMs } : countdownProps ) {

    const progress = Math.min( 100, ( remainingMs / VOTING_DURATION_MS ) * 100 )

    const isRunningOut = remainingMs <= WARNING_MS

    return (

        <div className="rounded-3xl bg-stone-900 p-5 text-amber-50 shadow">

            <p className="text-xs uppercase tracking-widest text-amber-200">Tiempo para decidir</p>

            <p
                className={`font-mono text-5xl font-black tabular-nums ${isRunningOut ? "text-red-400 animate-pulse" : ""}`}
                role="timer"
                aria-live="off"
            >
                {formatCountdown( remainingMs )}
            </p>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-700">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${isRunningOut ? "bg-red-500" : "bg-amber-400"}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="mt-2 text-sm text-stone-300">
                Cuando llegue a cero, Antojo Gourmet decide con los votos que haya.
            </p>

        </div>

    )

}
