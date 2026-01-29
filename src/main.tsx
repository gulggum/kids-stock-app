import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AppThemeProvider from "./theme/ThemeProvider.tsx";
import { AppRouter } from "./router/router.tsx";
import { PortfolioProvider } from "./context/PortfolioContext.tsx";
import { CoinProvider } from "./context/Coin&Money/CoinContext.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";
import { ItemProvider } from "./context/ItemContext.tsx";
import { CharacterProvider } from "./context/CharacterContext.tsx";
import { BadgeProvider } from "./context/BadgeContext.tsx";
import { TradeProvider } from "./context/TradeContext.tsx";
import { ModalProvider } from "./context/ModalContext.tsx";
import { MoneyProvider } from "./context/Coin&Money/MoneyContext.tsx";
import { AttendanceProvider } from "./context/AttendanceContext.tsx";
import { MissionProvider } from "./context/MissionContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {" "}
    <AppThemeProvider>
      <ModalProvider>
        <ToastProvider>
          <CoinProvider>
            <AttendanceProvider>
              <MissionProvider>
                <MoneyProvider>
                  <TradeProvider>
                    <BadgeProvider>
                      <CharacterProvider>
                        <ItemProvider>
                          <PortfolioProvider>
                            <AppRouter />
                            <App />
                          </PortfolioProvider>
                        </ItemProvider>
                      </CharacterProvider>
                    </BadgeProvider>
                  </TradeProvider>
                </MoneyProvider>
              </MissionProvider>
            </AttendanceProvider>
          </CoinProvider>
        </ToastProvider>
      </ModalProvider>
    </AppThemeProvider>
  </StrictMode>,
);
