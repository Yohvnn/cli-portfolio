import { useEffect, useState } from "react";

function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/** Returns a live HH:MM clock string and a tick boolean (alternates every second) for colon animation. */
export function useClock(): { time: string; tick: boolean } {
    const [state, setState] = useState(() => {
        const now = new Date();
        return { time: formatTime(now), tick: now.getSeconds() % 2 === 0 };
    });

    useEffect(() => {
        const id = setInterval(() => {
            const now = new Date();
            setState({ time: formatTime(now), tick: now.getSeconds() % 2 === 0 });
        }, 1000);
        return () => clearInterval(id);
    }, []);

    return state;
}
