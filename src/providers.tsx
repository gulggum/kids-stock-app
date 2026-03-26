import AppThemeProvider from "./theme/ThemeProvider";
import { UIProvider } from "./context/UIContext/UIProvider";
import { WalletProvider } from "./context/WalletContext/WalletProvider";
import { UserProgressProvider } from "./context/UserContext/UserProgressProvider";
import { AttendanceProvider } from "./context/AttendanceContext";
import { QuizProvider } from "./context/QuizContext/QuizProvider";
import { PortfolioProvider } from "./context/PortfolioContext";
import { TradeProvider } from "./context/TradeContext";
import { RewardProvider } from "./context/RewardContext";
import { AchievementProvider } from "./context/AchievementContext/AchievementContext";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// QueryClient 인스턴스 생성 (파일 최상단에 선언)
const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthProvider>
          <UIProvider>
            <WalletProvider>
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
            </WalletProvider>
          </UIProvider>
        </AuthProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
};
