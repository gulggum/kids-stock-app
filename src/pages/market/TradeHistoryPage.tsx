// 📍 src/pages/TradeHistoryPage.tsx

import { useSearchParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "../../utils/supabase";
import { useUser } from "../../context/UserContext";

type Trade = {
  id: string;
  stock_id: string;
  stocks: { name: string } | null;
  type: "BUY" | "SELL";
  price: number;
  quantity: number;
  country: "KR" | "US";
  reason: string | null;
  created_at: string;
};

const TradeHistoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const tab = (searchParams.get("tab") as "KR" | "US") ?? "KR";
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user.id) return;

    const fetch = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("trades")
        .select(`*, stocks(name)`)
        .eq("user_id", user.id)
        .eq("country", tab)
        .order("created_at", { ascending: false });

      if (error) console.error("거래내역 불러오기 실패:", error);
      setTrades(data ?? []);
      setIsLoading(false);
    };

    fetch();
  }, [user.id, tab]);

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>← 뒤로</BackButton>
        <Title>거래 내역</Title>
      </Header>

      <TabBar>
        <Tab
          $active={tab === "KR"}
          onClick={() => setSearchParams({ tab: "KR" })}
        >
          🇰🇷 원화 거래
        </Tab>
        <Tab
          $active={tab === "US"}
          onClick={() => setSearchParams({ tab: "US" })}
        >
          🇺🇸 달러 거래
        </Tab>
      </TabBar>

      {isLoading && <Empty>불러오는 중...</Empty>}

      {!isLoading && trades.length === 0 && (
        <Empty>아직 거래 내역이 없어요 📭</Empty>
      )}

      {!isLoading &&
        trades.map((trade) => (
          <TradeCard key={trade.id}>
            <TradeTop>
              <TypeBadge $isBuy={trade.type === "BUY"}>
                {trade.type === "BUY" ? "매수" : "매도"}
              </TypeBadge>
              <StockId>{trade.stocks?.name ?? trade.stock_id}</StockId>
              <DateText>{trade.created_at.slice(0, 10)}</DateText>
            </TradeTop>
            <TradeBottom>
              <Amount>
                {tab === "KR"
                  ? `${(trade.price * trade.quantity).toLocaleString()}원`
                  : `$${(trade.price * trade.quantity).toLocaleString()}`}
              </Amount>
              <Detail>
                {trade.quantity}주 ×{" "}
                {tab === "KR"
                  ? `${trade.price.toLocaleString()}원`
                  : `$${trade.price}`}
              </Detail>
            </TradeBottom>
            {trade.reason && <Reason>💬 {trade.reason}</Reason>}
          </TradeCard>
        ))}
    </Wrapper>
  );
};

export default TradeHistoryPage;

/* ===== 스타일 ===== */

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 100dvh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.button`
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 800;
`;

const TabBar = styled.div`
  display: flex;
  gap: 8px;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ $active }) => ($active ? "white" : "#666")};
`;

const Empty = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;

const TradeCard = styled.div`
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.card};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TradeTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TypeBadge = styled.span<{ $isBuy: boolean }>`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  background: ${({ $isBuy }) => ($isBuy ? "#dcfce7" : "#fee2e2")};
  color: ${({ $isBuy }) => ($isBuy ? "#16a34a" : "#dc2626")};
`;

const StockId = styled.span`
  font-size: 13px;
  font-weight: 700;
  flex: 1;
`;

const DateText = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
`;

const TradeBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Amount = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const Detail = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Reason = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding-top: 4px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;
