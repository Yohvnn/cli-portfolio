/**
 * TypingCursor — blinking underscore appended after typed text,
 * matching the terminal aesthetic of the site.
 */
export function TypingCursor() {
    return (
        <span
            aria-hidden="true"
            className="typing-cursor"
        >
            _
        </span>
    );
}
