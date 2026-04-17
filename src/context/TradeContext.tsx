//거래 기록만 저장(원본 데이터)
// 언제,어떤종목을,어떻게 거래했는지 전부 기록하는 곳(구매,매도,히스토리)

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useUser } from "./UserContext";
import { supabase } from "../utils/supabase";

type TradeType = "BUY" | "SELL";

type Trade = {
  id: string; //거래 고유값(거래id)
  stockId: number; //어떤 주식인지(회사id)
  stockName: string; //이름(ui용)
  price: number; //거래 당시 1주 가격
  quantity: number; //거래수량
  type: TradeType; //"buy","sell"
  createdAt: string; // ISO date(언제 했는지 (날짜 판단용))
  country?: "KR" | "US";
  reason?: string;
};

// Context에서 제공할 API(하루1회제한,오늘의한번배지,부모리포트,경험치 정책)
type TradeContextType = {
  trades: Trade[]; // 전체 거래 내역
  buyStock: (stock: {
    id: number;
    name: string;
    price: number;
    country?: "KR" | "US";
    reason?: string;
  }) => boolean;
  sellStock: (stock: {
    id: number;
    name: string;
    price: number;
    country?: "KR" | "US";
  }) => boolean;
  hasBoughtToday: boolean; // 오늘 이미 샀는지
  isHoldingStock: (id: number) => boolean;
};

const TradeContext = createContext<TradeContextType>({} as TradeContextType);

export const TradeProvider = ({ children }: { children: React.ReactNode }) => {
  const [trades, setTrades] = useState<Trade[]>([]);

  const { user } = useUser();
  // 3. 앱 시작 시 Supabase에서 불러오기 추가
  useEffect(() => {
    if (!user.id) return;

    const fetchTrades = async () => {
      const { data } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (data) {
        setTrades(
          data.map((t) => ({
            id: t.id,
            stockId: t.stock_id,
            stockName: t.stock_name,
            price: t.price,
            quantity: t.quantity,
            type: t.type,
            createdAt: t.created_at,
            country: t.country,
            reason: t.reason,
          })),
        );
      }
    };

    fetchTrades();
  }, [user.id]); // user.id 바뀔 때만 실행

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
  const buyStock = (stock: {
    id: number;
    name: string;
    price: number;
    country?: "KR" | "US";
    reason?: string;
  }) => {
    const newTrade: Trade = {
      id: crypto.randomUUID(),
      stockId: stock.id,
      stockName: stock.name,
      price: stock.price,
      quantity: 1,
      type: "BUY",
      createdAt: new Date().toISOString(),
      country: stock.country ?? "KR",
      reason: stock.reason,
    };

    setTrades((prev) => [...prev, newTrade]);

    // ✅ Supabase 저장 추가
    if (user.id) {
      supabase
        .from("trades")
        .insert({
          id: newTrade.id,
          user_id: user.id,
          stock_id: newTrade.stockId,
          stock_name: newTrade.stockName,
          price: newTrade.price,
          quantity: newTrade.quantity,
          type: newTrade.type,
          country: newTrade.country,
          created_at: newTrade.createdAt,
          reason: newTrade.reason ?? null,
        })
        .then(({ error }) => {
          if (error) console.error("거래 저장 실패:", error);
        });
    }

    return true; //구매성공
  };

  //주식 판매
  const sellStock = (stock: {
    id: number;
    name: string;
    price: number;
    country?: "KR" | "US";
  }) => {
    if (!isHoldingStock(stock.id)) return false;

    const newTrade: Trade = {
      id: crypto.randomUUID(),
      stockId: stock.id,
      stockName: stock.name,
      price: stock.price,
      country: stock.country,
      quantity: 1,
      type: "SELL",
      createdAt: new Date().toISOString(),
    };

    setTrades((prev) => [...prev, newTrade]);

    // ✅ Supabase 저장 추가
    if (user.id) {
      supabase
        .from("trades")
        .insert({
          id: newTrade.id,
          user_id: user.id,
          stock_id: newTrade.stockId,
          stock_name: newTrade.stockName,
          price: newTrade.price,
          quantity: newTrade.quantity,
          type: newTrade.type,
          country: newTrade.country,
          created_at: newTrade.createdAt,
        })
        .then(({ error }) => {
          if (error) console.error("거래 저장 실패:", error);
        });
    }

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
