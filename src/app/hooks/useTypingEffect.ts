import { useState, useEffect } from "react";

/** Hook that types out text character-by-character with configurable speed and delay. */
export function useTypingEffect(text: string, speed: number = 50, delay: number = 0) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);

    const delayTimeout = setTimeout(() => {
      const typingInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex < text.length) {
            setDisplayedText(text.substring(0, prevIndex + 1));
            return prevIndex + 1;
          } else {
            clearInterval(typingInterval);
            return prevIndex;
          }
        });
      }, speed);

      return () => clearInterval(typingInterval);
    }, delay);

    return () => clearTimeout(delayTimeout);
  }, [text, speed, delay]);

  return displayedText;
}
