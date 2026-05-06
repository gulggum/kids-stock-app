//총자산 요약 카드

import styled from "styled-components";
import { usePortfolio } from "../../context/PortfolioContext";
import { useTrade } from "../../context/TradeContext";
import { usePortfolioStocks } from "../../hooks/Useportfoliostocks";
import { useUser } from "../../context/UserContext";
import { useExchangeRate } from "../../hooks/useExchangeRate";

const BASE_MONEY = 5000000;

const PortfolioSummaryCard = () => {
  const { portfolio } = usePortfolio();
  const { hasBoughtToday } = useTrade();
  const { user } = useUser();
  const { getCurrentPrice } = usePortfolioStocks(portfolio);
  const exchangeRate = useExchangeRate();

  const stockCount = portfolio.length;

  // 주식 평가금액 (KR은 원화, US는 달러→원화 환산)
  const evaluationAmount = portfolio.reduce((total, item) => {
    const currentPrice = getCurrentPrice(item);
    const valueInKrw =
      item.country === "US"
        ? currentPrice * exchangeRate
        : currentPrice * item.quantity;
    return total + valueInKrw;
  }, 0);

  // 달러 → 원화 환산
  const dollarsInKrw = (user.dollars ?? 0) * exchangeRate;

  // 총 자산 = 원화 현금 + 달러(원화환산) + 주식 평가금액
  const totalAsset = user.money + dollarsInKrw + evaluationAmount;

  const profit = totalAsset - BASE_MONEY;
  const profitRate = (profit / BASE_MONEY) * 100;
  const isUp = profit >= 0;

  return (
    <Card>
      {hasBoughtToday && <Badge>오늘의 한 번 🎖️</Badge>}

      {/* 총 자산 */}
      <AssetSection>
        <AssetLabel>내 전체 자산 💰</AssetLabel>
        <AssetValue>{Math.round(totalAsset).toLocaleString()}원</AssetValue>
        <Profit $isUp={isUp}>
          {isUp ? "📈 +" : "📉 "}
          {Math.abs(Math.round(profit)).toLocaleString()}원 (
          {profitRate.toFixed(1)}%)
        </Profit>
      </AssetSection>

      <Divider />

      {/* 자산 구성 */}
      <Row>
        <Label>🇰🇷 원화 현금</Label>
        <Value>{user.money.toLocaleString()}원</Value>
      </Row>
      <Row>
        <Label>🇺🇸 달러</Label>
        <ValueGroup>
          <Value>${(user.dollars ?? 0).toLocaleString()}</Value>
          <SubValue>({dollarsInKrw.toLocaleString()}원)</SubValue>
        </ValueGroup>
      </Row>
      <Row>
        <Label>📊 보유 주식 ({stockCount}개)</Label>
        <Value>{Math.round(evaluationAmount).toLocaleString()}원</Value>
      </Row>
    </Card>
  );
};

export default PortfolioSummaryCard;

/* ================= 스타일 ================= */

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Badge = styled.div`
  align-self: flex-start;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
`;

const AssetSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AssetLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const AssetValue = styled.span`
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const Profit = styled.span<{ $isUp: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme, $isUp }) => ($isUp ? theme.colors.up : theme.colors.down)};
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 4px 0;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Value = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const ValueGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

const SubValue = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
`;
