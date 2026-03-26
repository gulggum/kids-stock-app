import { MoneyProvider } from "./MoneyContext";

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return <MoneyProvider>{children}</MoneyProvider>;
};
