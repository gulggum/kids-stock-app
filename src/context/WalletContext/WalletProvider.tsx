import { CoinProvider } from "./CoinContext";
import { MoneyProvider } from "./MoneyContext";

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CoinProvider>
      <MoneyProvider>{children}</MoneyProvider>
    </CoinProvider>
  );
};
