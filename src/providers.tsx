import AppThemeProvider from "./theme/ThemeProvider";
import { UIProvider } from "./context/UIContext/UIProvider";
import { WalletProvider } from "./context/WalletContext/WalletProvider";
import { UserProgressProvider } from "./context/UserContext/UserProgressProvider";
import { AttendanceProvider } from "./context/AttendanceContext";
import { QuizProvider } from "./context/QuizContext/QuizProvider";
import { PortfolioProvider } from "./context/PortfolioContext";
import { TradeProvider } from "./context/TradeContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppThemeProvider>
      <UIProvider>
        <WalletProvider>
          <UserProgressProvider>
            <AttendanceProvider>
              <QuizProvider>
                <TradeProvider>
                  <PortfolioProvider>{children}</PortfolioProvider>
                </TradeProvider>
              </QuizProvider>
            </AttendanceProvider>
          </UserProgressProvider>
        </WalletProvider>
      </UIProvider>
    </AppThemeProvider>
  );
};
