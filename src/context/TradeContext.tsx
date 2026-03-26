//거래 기록만 저장(원본 데이터)
// 언제,어떤종목을,어떻게 거래했는지 전부 기록하는 곳(구매,매도,히스토리)

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getStorage, setStorage } from "../utils/storage";

type TradeType = "BUY" | "SELL";

type Trade = {
  id: string; //거래 고유값(거래id)
  stockId: number; //어떤 주식인지(회사id)
  stockName: string; //이름(ui용)
  price: number; //거래 당시 1주 가격
  quantity: number; //거래수량
  type: TradeType; //"buy","sell"
  createdAt: string; // ISO date(언제 했는지 (날짜 판단용))
};

// Context에서 제공할 API(하루1회제한,오늘의한번배지,부모리포트,경험치 정책)
type TradeContextType = {
  trades: Trade[]; // 전체 거래 내역
  buyStock: (stock: { id: number; name: string; price: number }) => boolean;
  sellStock: (stock: { id: number; name: string; price: number }) => boolean;
  hasBoughtToday: boolean; // 오늘 이미 샀는지
  isHoldingStock: (id: number) => boolean;
};

const TradeContext = createContext<TradeContextType>({} as TradeContextType);

const TRADE_KEY = `trade_history`;

export const TradeProvider = ({ children }: { children: React.ReactNode }) => {
  const [trades, setTrades] = useState<Trade[]>(() =>
    getStorage(TRADE_KEY, []),
  );

  //오늘 구매했는지 확인
  const hasBoughtToday = useMemo(() => {
    const today = new Date().toDateString();

    return trades.some(
      (trade) =>
        trade.type === "BUY" &&
        new Date(trade.createdAt).toDateString() === today,
    );
  }, [trades]);

  //주식 구매
  const buyStock = (stock: { id: number; name: string; price: number }) => {
    if (hasBoughtToday) return false; //1회제한
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

  //주식 판매
  const sellStock = (stock: { id: number; name: string; price: number }) => {
    if (!isHoldingStock(stock.id)) return false;

    const newTrade: Trade = {
      id: crypto.randomUUID(),
      stockId: stock.id,
      stockName: stock.name,
      price: stock.price,
      quantity: 1,
      type: "SELL",
      createdAt: new Date().toISOString(),
    };

    setTrades((prev) => [...prev, newTrade]);

    return true;
  };

  //보유 여부 판단 - BUY 기록이 하나라도 있으면 보유 중으로 판단
  const isHoldingStock = (companyId: number) => {
    const quantity = trades.reduce((total, trade) => {
      if (trade.stockId !== companyId) return total;

      if (trade.type === "BUY") return total + trade.quantity;
      if (trade.type === "SELL") return total - trade.quantity;

      return total;
    }, 0);

    return quantity > 0;
  };

  // TODO: Supabase 연동 시 localStorage 저장 제거, DB로 이전
  useEffect(() => {
    setStorage(TRADE_KEY, trades);
  }, [trades]);

  return (
    <TradeContext.Provider
      value={{ trades, buyStock, sellStock, hasBoughtToday, isHoldingStock }}
    >
      {children}
    </TradeContext.Provider>
  );
};

export const useTrade = () => {
  const context = useContext(TradeContext);
  if (!context) throw new Error("useTrade must be used within TradeProvider");
  return context;
};
