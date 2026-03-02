import { useReturningVisitor } from "./useReturningVisitor";

type Period = "Morning" | "Afternoon" | "Evening" | "Night";

function getPeriod(hour: number): Period {
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 21) return "Evening";
    return "Night";
}

/** Returns the i18n key for the time-aware, visit-aware greeting. */
export function useGreeting(): string {
    const isReturning = useReturningVisitor();
    const period = getPeriod(new Date().getHours());
    return `profile.name${period}${isReturning ? "Returning" : ""}`;
}
