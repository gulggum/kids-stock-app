import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AppThemeProvider from "./theme/ThemeProvider.tsx";
import { AppRouter } from "./router/router.tsx";
import { PortfolioProvider } from "./context/PortfolioContext.tsx";
import { CoinProvider } from "./context/CoinContext.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {" "}
    <AppThemeProvider>
      <ToastProvider>
        <CoinProvider>
          <PortfolioProvider>
            <AppRouter />
            <App />
          </PortfolioProvider>
        </CoinProvider>
      </ToastProvider>
    </AppThemeProvider>
  </StrictMode>,
);
