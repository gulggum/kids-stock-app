import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AppThemeProvider from "./theme/ThemeProvider.tsx";
import { AppRouter } from "./router/router.tsx";
import { PortfolioProvider } from "./context/PortfolioContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PortfolioProvider>
      <AppThemeProvider>
        <AppRouter />
        <App />
      </AppThemeProvider>
    </PortfolioProvider>
  </StrictMode>,
);
