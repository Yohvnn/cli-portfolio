import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDarkMode } from "../hooks/useDarkMode";
import { useLanguage } from "../hooks/useLanguage";
import { useClock } from "../hooks/useClock";

/**
 * Fixed CLI-style toolbar with dark/light mode toggle, language switch, and scroll-to-top.
 */
export function CliToolbar() {
    const { t } = useTranslation();
    const { isDark, toggle: toggleTheme } = useDarkMode();
    const { lang, toggle: toggleLang } = useLanguage();
    const [showTop, setShowTop] = useState(false);
    const [terminalCommand, setTerminalCommand] = useState("");
    const [isTerminalActive, setIsTerminalActive] = useState(false);
    const terminalInputRef = useRef<HTMLInputElement>(null);
    const time = useClock();
    const [hours, minutes] = time.time.split(':');

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 300);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (isTerminalActive) {
            terminalInputRef.current?.focus();
        }
    }, [isTerminalActive]);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const handleTerminalCommand = () => {
        const normalized = terminalCommand.trim().replaceAll(/\s+/g, " ").toLowerCase();
        if (normalized === "cd iteria") {
            globalThis.open("https://iteria.yohanncch.studio/", "_self");
        }
    };

    return (
        <nav
            aria-label="CLI controls"
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-sm"
        >
            <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-3">
                {/* prompt + live clock */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 min-w-[12rem] sm:min-w-[16rem]">
                        <button
                            type="button"
                            onClick={() => setIsTerminalActive(true)}
                            className="text-accent text-[10px] sm:text-xs tracking-widest select-none"
                        >
                            ~/ycch $
                        </button>

                        {isTerminalActive ? (
                            <div className="flex items-center min-w-[6rem] sm:min-w-[9rem]">
                                <input
                                    id="portfolio-cli-command"
                                    ref={terminalInputRef}
                                    aria-label="Portfolio CLI command"
                                    value={terminalCommand}
                                    onChange={(event) => setTerminalCommand(event.target.value)}
                                    onBlur={() => {
                                        if (!terminalCommand.trim()) {
                                            setIsTerminalActive(false);
                                        }
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleTerminalCommand();
                                        }
                                        if (event.key === "Escape") {
                                            setTerminalCommand("");
                                            setIsTerminalActive(false);
                                            terminalInputRef.current?.blur();
                                        }
                                    }}
                                    className="w-full bg-transparent border-none outline-none text-[10px] sm:text-xs tracking-[0.14em] text-foreground"
                                    spellCheck={false}
                                    autoComplete="off"
                                    autoCapitalize="off"
                                    autoCorrect="off"
                                />
                            </div>
                        ) : (
                            <button
                                type="button"
                                aria-label="Activate command line"
                                onClick={() => setIsTerminalActive(true)}
                                className="flex items-center"
                            >
                                <span className="text-[10px] sm:text-xs opacity-40 select-none tabular-nums">{hours}</span>
                                <span className={`text-[10px] sm:text-xs opacity-40 select-none ${time.tick ? 'visible' : 'invisible'}`}>:</span>
                                <span className="text-[10px] sm:text-xs opacity-40 select-none tabular-nums">{minutes}</span>
                            </button>
                        )}
                    </div>


                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                    {/* scroll to top */}
                    <button
                        onClick={scrollToTop}
                        title={t("app.scrollToTop", "Scroll to top")}
                        className={`group flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer ${showTop
                            ? "opacity-70 hover:opacity-100 hover:text-accent translate-y-0"
                            : "opacity-0 pointer-events-none translate-y-2"
                            }`}
                    >
                        <span className="text-accent">[</span>
                        <span>↑ {t("nav.topButton")} </span>
                        <span className="text-accent">]</span>
                    </button>
                    <button
                        onClick={toggleTheme}
                        title={t("app.toggleDarkMode")}
                        className="group flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest opacity-70 hover:opacity-100 hover:text-accent transition-all duration-200 cursor-pointer"
                    >
                        <span className="text-accent">[</span>
                        <span>{(isDark ? t("nav.darkButton") : t("nav.lightButton"))}</span>
                        <span className="text-accent">]</span>
                    </button>

                    <button
                        onClick={toggleLang}
                        title={t("app.toggleLanguage")}
                        className="group flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest opacity-70 hover:opacity-100 hover:text-accent transition-all duration-200 cursor-pointer"
                    >
                        <span className="text-accent">[</span>
                        <span>{lang === "en" ? "EN" : "FR"}</span>
                        <span className="text-accent">]</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
