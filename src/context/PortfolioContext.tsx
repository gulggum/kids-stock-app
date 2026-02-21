// [보유 현황 계산 : TradeContext의 기록을 토대로 계산된 결과(파생 데이터)]
// TradeContext.trades
//    ↓
// BUY / SELL 묶기
//    ↓
// 종목별 수량 합산
//    ↓
// 평균 단가 계산
//    ↓
// PortfolioItem 생성
//⭕ Trade가 바뀌면 Portfolio가 자동으로 다시 계산됨

import { useContext, createContext, useMemo } from "react";
import { useTrade } from "./TradeContext";
import { companyMeta } from "../data/static/companyMeta";

type PortfolioItem = {
  id: string; //회사id
  name: string; //회사명
  quantity: number; //보유 수량
  buyPrice: number; //평균 매수가(📍 첫구매시 구매가격과동일,추가매수시 누적 평균가격)
};

type PortfolioContextType = {
  portfolio: PortfolioItem[];
  totalAsset: number; //총자산
};

const PortfolioContext = createContext<PortfolioContextType>(
  {} as PortfolioContextType,
);

export const PortfolioProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { trades } = useTrade(); //// 🔹 TradeContext에서 거래 원본 데이터 가져옴

  // portfolio 계산 , trades가 바뀔 때만 다시 계산됨,렌더링마다 반복 계산되는 것을 방지하기 위해 useMemo 사용
  const portfolio = useMemo(() => {
    const map = new Map<string, PortfolioItem>();

    trades.forEach((trade) => {
      // SELL은 아직 고려 안 함 (나중에 확장)
      if (trade.type !== "BUY") return;

      const existing = map.get(trade.stockId);

      if (!existing) {
        // 📌 첫 매수
        // buyPrice는 이 시점에서는 '구매 가격'과 동일
        map.set(trade.stockId, {
          id: trade.stockId,
          name: trade.stockName,
          quantity: trade.quantity,
          buyPrice: trade.price,
        });
      } else {
        // 📌 추가 매수, 이미 있는 종목이면 평균단가 계산
        const totalQuantity = existing.quantity + trade.quantity;
        const totalCost =
          existing.buyPrice * existing.quantity + trade.price * trade.quantity;

        existing.quantity = totalQuantity;
        existing.buyPrice = Math.round(totalCost / totalQuantity);
      }
    });

    // Map → 배열로 변환 (UI에서 쓰기 좋게)
    return Array.from(map.values());
  }, [trades]); // ⭐ trades가 바뀔 때만 재계산

  // 2️⃣ totalAsset 계산 (portfolio 기반)
  const totalAsset = useMemo(() => {
    const BASE_MONEY = 100000;

    const evaluationAmount = portfolio.reduce((total, item) => {
      const currentPrice = companyMeta[item.id].price;
      return total + currentPrice * item.quantity;
    }, 0);

    return BASE_MONEY + evaluationAmount;
  }, [portfolio]);

  return (
    <PortfolioContext.Provider value={{ portfolio, totalAsset }}>
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
