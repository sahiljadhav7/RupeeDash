import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const LEGACY_STORE_KEY = "finance-dashboard";
const THEME_STORAGE_KEY = "rupeedash-theme";

// Preserve the previous dark mode preference the first time next-themes takes over.
try {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (!storedTheme) {
    const stored = JSON.parse(localStorage.getItem(LEGACY_STORE_KEY) || "{}");
    const legacyDarkMode = stored?.state?.darkMode;
    if (typeof legacyDarkMode === "boolean") {
      localStorage.setItem(THEME_STORAGE_KEY, legacyDarkMode ? "dark" : "light");
    }
  }
} catch {
  // Ignore malformed legacy state and continue bootstrapping the app.
}

createRoot(document.getElementById("root")!).render(<App />);
