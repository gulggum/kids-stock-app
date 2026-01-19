import { useContext, useState, createContext } from "react";

type PortfolioItem = {
  id: string; //회사id
  name: string; //회사명
  quantity: number; //수량
  buyPrice: number; //평균 구매 가격
};

type PortfolioContextType = {
  items: PortfolioItem[];
  addItem: (item: PortfolioItem) => void;
};

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  //포트폴리오 상태(앱 전체에서 공유)
  const [items, setItems] = useState<PortfolioItem[]>([]);

  //포트폴리오에 주식 추가(지금은 단순push, 나중에 평균단가 계산 가능)
  const addItem = (item: PortfolioItem) => {
    setItems((prev) => [...prev, item]);
  };
  console.log("도착 넘어옴!!", items);
  return (
    <PortfolioContext.Provider value={{ items, addItem }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return ctx;
};

export default PortfolioContext;
