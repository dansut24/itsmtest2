import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ThemeModeProvider } from "./context/ThemeContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeModeProvider>
      <AppWithTheme />
    </ThemeModeProvider>
  </React.StrictMode>
);

function AppWithTheme() {
  const { mode } = React.useContext(require("./context/ThemeContext").ThemeModeContext);

  const theme = React.useMemo(() =>
    createTheme({
      palette: {
        mode,
        primary: {
          main: "#1976d2",
        },
        background: {
          default: mode === "dark" ? "#121212" : "#fff",
          paper: mode === "dark" ? "#1e1e1e" : "#fff",
        },
      },
    }), [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}
