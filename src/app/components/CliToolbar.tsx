import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDarkMode } from "../hooks/useDarkMode";
import { useLanguage } from "../hooks/useLanguage";

/**
 * Fixed CLI-style toolbar with dark/light mode toggle, language switch, and scroll-to-top.
 */
export function CliToolbar() {
    const { t } = useTranslation();
    const { isDark, toggle: toggleTheme } = useDarkMode();
    const { lang, toggle: toggleLang } = useLanguage();
    const [showTop, setShowTop] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 300);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <nav
            aria-label="CLI controls"
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-sm"
        >
            <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-3">
                {/* prompt prefix */}
                <span className="text-accent text-[10px] sm:text-xs tracking-widest select-none">
                    ~/ycch $
                </span>

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
                        <span>↑ TOP</span>
                        <span className="text-accent">]</span>
                    </button>
                    <button
                        onClick={toggleTheme}
                        title={t("app.toggleDarkMode")}
                        className="group flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest opacity-70 hover:opacity-100 hover:text-accent transition-all duration-200 cursor-pointer"
                    >
                        <span className="text-accent">[</span>
                        <span>{isDark ? "DARK" : "LIGHT"}</span>
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
