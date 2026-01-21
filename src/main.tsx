import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AppThemeProvider from "./theme/ThemeProvider.tsx";
import { AppRouter } from "./router/router.tsx";
import { PortfolioProvider } from "./context/PortfolioContext.tsx";
import { CoinProvider } from "./context/CoinContext.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";
import { ItemProvider } from "./context/ItemContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {" "}
    <AppThemeProvider>
      <ToastProvider>
        <CoinProvider>
          <ItemProvider>
            <PortfolioProvider>
              <AppRouter />
              <App />
            </PortfolioProvider>
          </ItemProvider>
        </CoinProvider>
      </ToastProvider>
    </AppThemeProvider>
  </StrictMode>,
);
