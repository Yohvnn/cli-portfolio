
import { createRoot } from "react-dom/client";
import "./i18n";
import App from "./app/App.tsx";
import "./styles/index.css";

const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.classList.add(savedTheme);

const savedLang = localStorage.getItem("lang") || "en";
document.documentElement.lang = savedLang;

createRoot(document.getElementById("root")!).render(<App />);
