import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeModeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./components/ui/Toast";
import { useThemeStore } from "./store/itsmStore";
import "./index.css";
import "./hi5.css";

// Apply hi5 theme class to <html> whenever the Zustand theme store changes
function ThemeApplier({ children }) {
  const { mode } = useThemeStore();

  useEffect(() => {
    const html = document.documentElement;
    // Remove all hi5 theme classes
    html.classList.remove("dark", "theme-ocean", "theme-forest", "theme-sunset");
    if (mode === "dark")   html.classList.add("dark");
    if (mode === "ocean")  html.classList.add("theme-ocean");
    if (mode === "forest") html.classList.add("theme-forest");
    if (mode === "sunset") html.classList.add("theme-sunset");
  }, [mode]);

  return children;
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeModeProvider>
      <ToastProvider>
        <ThemeApplier>
          <App />
        </ThemeApplier>
      </ToastProvider>
    </ThemeModeProvider>
  </React.StrictMode>
);
