import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Restore dark mode from persisted state
try {
  const stored = JSON.parse(localStorage.getItem("finance-dashboard") || "{}");
  if (stored?.state?.darkMode) document.documentElement.classList.add("dark");
} catch {}

createRoot(document.getElementById("root")!).render(<App />);
