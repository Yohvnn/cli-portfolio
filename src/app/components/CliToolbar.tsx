import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDarkMode } from "../hooks/useDarkMode";
import { useLanguage } from "../hooks/useLanguage";
import { useClock } from "../hooks/useClock";

const EXTERNAL_COMMANDS = {
    iteria: "https://iteria.yohanncch.studio/",
    leafy: "https://leafy.yohanncch.studio/",
} as const;

const TERMINAL_USERNAME_STORAGE_KEY = "cli-portfolio:terminal-username";

const LISTING_ROOT = "projects/";
const LISTING_PROJECTS = ["iteria/", "leafy/"] as const;
const USERNAME_PREFIXES = ["neo", "root", "byte", "hex", "quant", "sys"] as const;
const USERNAME_SUFFIXES = ["fox", "node", "pulse", "orbit", "stack", "vector"] as const;
const USERNAME_GUEST_FALLBACK = "guest_00";
const USERNAME_DISCRIMINATOR_MAX = 100;
const USERNAME_DISCRIMINATOR_WIDTH = 2;
const USERNAME_RANDOM_BYTES_BITS = 32;
const USERNAME_RANDOM_BYTES_RANGE = 2 ** USERNAME_RANDOM_BYTES_BITS;

type ParsedCommand = {
    command: string;
    argument: string;
};

function parseTerminalCommand(value: string): ParsedCommand {
    const [command = "", ...rest] = value.trim().split(/\s+/);
    const argument = rest.join(" ").replaceAll(/^['"]|['"]$/g, "").toLowerCase();

    return {
        command: command.toLowerCase(),
        argument,
    };
}

function getSecureRandomInt(maxExclusive: number): number {
    if (maxExclusive <= 0) {
        throw new Error(`Expected maxExclusive to be greater than 0, received ${maxExclusive}.`);
    }

    const cryptoObject = globalThis.crypto;

    if (!cryptoObject?.getRandomValues) {
        throw new Error("Secure random values are not available in this environment.");
    }

    const values = new Uint32Array(1);
    const rejectionLimit = USERNAME_RANDOM_BYTES_RANGE - (USERNAME_RANDOM_BYTES_RANGE % maxExclusive);

    let randomValue = 0;

    do {
        cryptoObject.getRandomValues(values);
        randomValue = values[0];
    } while (randomValue >= rejectionLimit);

    return randomValue % maxExclusive;
}

function generateFakeTerminalUsername(): string {
    const prefix = USERNAME_PREFIXES[getSecureRandomInt(USERNAME_PREFIXES.length)];
    const suffix = USERNAME_SUFFIXES[getSecureRandomInt(USERNAME_SUFFIXES.length)];
    const discriminator = `${getSecureRandomInt(USERNAME_DISCRIMINATOR_MAX)}`.padStart(USERNAME_DISCRIMINATOR_WIDTH, "0");

    return `${prefix}_${suffix}${discriminator}`;
}

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
    const [isListingVisible, setIsListingVisible] = useState(false);
    const [terminalUsername, setTerminalUsername] = useState(USERNAME_GUEST_FALLBACK);
    const terminalInputRef = useRef<HTMLInputElement>(null);
    const listingRef = useRef<HTMLElement>(null);
    const time = useClock();
    const [hours, minutes] = time.time.split(":");

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

    useEffect(() => {
        const storedUsername = localStorage.getItem(TERMINAL_USERNAME_STORAGE_KEY);

        if (storedUsername) {
            setTerminalUsername(storedUsername);
            return;
        }

        const generatedUsername = generateFakeTerminalUsername();
        localStorage.setItem(TERMINAL_USERNAME_STORAGE_KEY, generatedUsername);
        setTerminalUsername(generatedUsername);
    }, []);

    useEffect(() => {
        if (!isListingVisible) {
            return;
        }

        const onPointerDown = (event: PointerEvent) => {
            if (!listingRef.current?.contains(event.target as Node)) {
                setIsListingVisible(false);
            }
        };

        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [isListingVisible]);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const handleTerminalCommand = () => {
        const { command, argument } = parseTerminalCommand(terminalCommand);

        setIsListingVisible(false);

        if (command === "cd" && argument in EXTERNAL_COMMANDS) {
            globalThis.open(EXTERNAL_COMMANDS[argument as keyof typeof EXTERNAL_COMMANDS], "_self");
            return;
        }

        if (command === "ls") {
            setIsListingVisible(true);
        }
    };

    return (
        <nav
            aria-label="CLI controls"
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-sm"
        >
            <div className="relative mx-auto flex max-w-4xl items-end justify-between px-6 py-3">
                {isListingVisible ? (
                    <section
                        ref={listingRef}
                        aria-label="Terminal output"
                        className="absolute bottom-full left-6 mb-3 w-[min(24rem,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-border bg-background/95 text-foreground shadow-[0_24px_80px_rgba(0,0,0,0.3)]"
                    >
                        <div className="flex items-center justify-between border-b border-border bg-background/80 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-foreground/60">
                            <span>
                                {t("nav.cliGreeting", "status 200: authorized user")}{" "}
                                <span className="text-accent">{terminalUsername}</span>
                            </span>
                            <span>{t("nav.cliShellTitle", "ystudio bash")}</span>
                        </div>
                        <div className="px-4 py-3 font-mono text-[11px] sm:text-xs">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-accent">
                                    <span>~/ycch</span>
                                    <span className="text-foreground">$</span>
                                    <span className="text-foreground">ls</span>
                                </div>
                                <button
                                    type="button"
                                    aria-label={t("nav.closeTerminalOutput", "Close terminal output")}
                                    onClick={() => setIsListingVisible(false)}
                                    className="rounded border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-foreground/70 transition-colors duration-200 hover:border-accent hover:text-accent"
                                >
                                    {t("nav.closeButton", "close")}
                                </button>
                            </div>
                            <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                                <div className="text-accent">{LISTING_ROOT}</div>
                                <div className="mt-1 space-y-1 text-foreground/90">
                                    {LISTING_PROJECTS.map((project) => (
                                        <div key={project} className="flex items-center gap-2">
                                            <span className="text-foreground/50">|-</span>
                                            <span>{project}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                                {t("nav.cliHint", "hint: cd iteria | cd leafy")}
                            </div>
                        </div>
                    </section>
                ) : null}

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
                                            setIsListingVisible(false);
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
