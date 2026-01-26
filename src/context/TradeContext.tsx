//거래 기록(원본 데이터)
// 언제,어떤종목을,어떻게 거래했는지 전부 기록하는 곳(구매,매도,히스토리)

import { createContext, useContext, useEffect, useState } from "react";

type TradeType = "BUY" | "SELL";

type Trade = {
  id: string; //거래 고유값
  stockId: string; //어떤 주식인지
  stockName: string; //이름(ui용)
  price: number; //거래 당시 1주 가격
  quantity: number; //거래수량
  type: TradeType; //"buy","sell"
  createdAt: string; // ISO date(언제 했는지 (날짜 판단용))
};

// Context에서 제공할 API(하루1회제한,오늘의한번배지,부모리포트,경험치 정책)
type TradeContextType = {
  trades: Trade[]; // 전체 거래 내역
  buyStock: (stock: { id: string; name: string; price: number }) => boolean;
  hasBoughtToday: () => boolean; // 오늘 이미 샀는지
};

const TradeContext = createContext<TradeContextType>({} as TradeContextType);

const TRADE_KEY = `trade_history`;

export const TradeProvider = ({ children }: { children: React.ReactNode }) => {
  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem(TRADE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  //오늘 구매했는지 확인
  const hasBoughtToday = () => {
    const today = new Date().toLocaleString();

    return trades.some(
      (trade) =>
        trade.type === "BUY" &&
        new Date(trade.createdAt).toDateString() === today,
    );
  };

  //주식 구매
  const buyStock = (stock: { id: string; name: string; price: number }) => {
    //하루 1회제한
    if (hasBoughtToday()) return false;

    const newTrade: Trade = {
      id: crypto.randomUUID(),
      stockId: stock.id,
      stockName: stock.name,
      price: stock.price,
      quantity: 1,
      type: "BUY",
      createdAt: new Date().toISOString(),
    };

    setTrades((prev) => [...prev, newTrade]);
    return true; //구매성공
  };
  useEffect(() => {
    localStorage.setItem(TRADE_KEY, JSON.stringify(trades));
  }, [trades]);

  return (
    <TradeContext.Provider value={{ trades, buyStock, hasBoughtToday }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrade = () => {
  const context = useContext(TradeContext);
  if (!context) throw new Error("useTrade must be used within TradeProvider");
  return context;
};
