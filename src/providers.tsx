import AppThemeProvider from "./theme/ThemeProvider";
import { UIProvider } from "./context/UIContext/UIProvider";
import { WalletProvider } from "./context/WalletContext/WalletProvider";
import { UserProgressProvider } from "./context/UserContext/UserProgressProvider";
import { AttendanceProvider } from "./context/AttendanceContext";
import { QuizProvider } from "./context/QuizContext/QuizProvider";
import { PortfolioProvider } from "./context/PortfolioContext";
import { TradeProvider } from "./context/TradeContext";
import { RewardProvider } from "./context/RewardContext";
import { ScoreProvider } from "./context/ScoreContext";
import { AchievementProvider } from "./context/AchievementContext/AchievementContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppThemeProvider>
      <UIProvider>
        <WalletProvider>
          <ScoreProvider>
            <UserProgressProvider>
              <RewardProvider>
                <QuizProvider>
                  <AttendanceProvider>
                    <TradeProvider>
                      <AchievementProvider>
                        <PortfolioProvider>{children}</PortfolioProvider>
                      </AchievementProvider>
                    </TradeProvider>
                  </AttendanceProvider>
                </QuizProvider>
              </RewardProvider>
            </UserProgressProvider>
          </ScoreProvider>
        </WalletProvider>
      </UIProvider>
    </AppThemeProvider>
  );
};
