import AppThemeProvider from "./theme/ThemeProvider";
import { UIProvider } from "./context/UIContext/UIProvider";
import { PortfolioProvider } from "./context/PortfolioContext";
import { TradeProvider } from "./context/TradeContext";
import { RewardProvider } from "./context/RewardContext";
import { AchievementProvider } from "./context/AchievementContext/AchievementContext";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserContext/UserContext";
import { SkinItemProvider } from "./context/UserContext/SkinItemContext";

// QueryClient 인스턴스 생성 (파일 최상단에 선언)
const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthProvider>
          <UIProvider>
            <UserProvider>
              <SkinItemProvider>
                <RewardProvider>
                  <TradeProvider>
                    <AchievementProvider>
                      <PortfolioProvider>{children}</PortfolioProvider>
                    </AchievementProvider>
                  </TradeProvider>
                </RewardProvider>
              </SkinItemProvider>
            </UserProvider>
          </UIProvider>
        </AuthProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
};
