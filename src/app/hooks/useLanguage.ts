import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useLanguage() {
    const { i18n } = useTranslation();

    const lang = i18n.language as "en" | "fr";

    const toggle = useCallback(() => {
        const next = lang === "en" ? "fr" : "en";
        i18n.changeLanguage(next);
        localStorage.setItem("lang", next);
        document.documentElement.lang = next;
    }, [lang, i18n]);

    return { lang, toggle };
}
