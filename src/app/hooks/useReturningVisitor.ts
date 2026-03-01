import { useEffect, useState } from "react";

const STORAGE_KEY = "cli-portfolio:visited";

/** Returns true if the user has visited before, and marks them as a returning visitor. */
export function useReturningVisitor(): boolean {
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem(STORAGE_KEY) === "1";
    setIsReturning(hasVisited);
    if (!hasVisited) localStorage.setItem(STORAGE_KEY, "1");
  }, []);

  return isReturning;
}
