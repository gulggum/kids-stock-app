// src/hooks/usePortfolioStocks.ts
// 포트폴리오 보유 종목들의 현재 가격을 Supabase에서 가져옴
// chartMock 대신 실제 가격 사용

import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

type PortfolioItem = {
  id: number;
  name: string;
  buyPrice: number;
  quantity: number;
};

type StockPrice = {
  id: number;
  price: number;
  symbol: string;
};

export function usePortfolioStocks(portfolio: PortfolioItem[]) {
  const [prices, setPrices] = useState<Record<number, number>>({}); // id → 현재가격
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (portfolio.length === 0) return;

    const fetchPrices = async () => {
      setLoading(true);

      const ids = portfolio.map((item) => item.id);

      const { data } = await supabase
        .from("stocks")
        .select("id, price, symbol")
        .in("id", ids);

      if (data) {
        const priceMap: Record<number, number> = {};
        (data as StockPrice[]).forEach((s) => {
          priceMap[s.id] = s.price;
        });
        setPrices(priceMap);
      }

      setLoading(false);
    };

    fetchPrices();
  }, [portfolio.length]); // 포트폴리오 종목 수 바뀔 때만 재조회

  // 현재가격 조회 (없으면 buyPrice 반환)
  const getCurrentPrice = (item: PortfolioItem): number => {
    return prices[item.id] ?? item.buyPrice;
  };

  return { getCurrentPrice, loading };
}
