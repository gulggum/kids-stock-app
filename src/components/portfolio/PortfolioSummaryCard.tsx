//총자산 요약 카드

import styled from "styled-components";
import { usePortfolio } from "../../context/PortfolioContext";
import { useTrade } from "../../context/TradeContext";
import { chartMock } from "../../data/mock/chartMock";
import { useUser } from "../../context/UserContext";

const BASE_MONEY = 1000000; //초기 사이버 머니(고정값)
const PortfolioSummaryCard = () => {
  const { portfolio } = usePortfolio();
  const { hasBoughtToday } = useTrade();
  const { user } = useUser();

  //보유 종목 수
  const stockCount = portfolio.length;

  //현재 평가 금액
  const evaluationAmount = portfolio.reduce((total, item) => {
    const chart = chartMock[item.id];

    const currentPrice =
      chart?.["7d"][chart["7d"].length - 1].price ?? item.buyPrice; //보유수량*현재가격
    return total + currentPrice * item.quantity; //모든주식 합산
  }, 0);

  //총 자산 = 초기머니(BASE_MONEY) +현재 평가 금액(evaluationAmount)
  const totalAsset = user.money + evaluationAmount;

  // ⭐ 수익 계산
  const profit = totalAsset - BASE_MONEY;
  const profitRate = (profit / BASE_MONEY) * 100;
  const isUp = profit >= 0;

  return (
    <Card>
      {/* 오늘의한번 뱃지🎖️*/}
      {!hasBoughtToday && <Badge>오늘의 한 번 🎖️</Badge>}

      {/* 총 자산 */}
      <AssetSection>
        <AssetLabel>내 자산 💰</AssetLabel>
        <AssetValue>{totalAsset.toLocaleString()}원</AssetValue>

        <Profit $isUp={isUp}>
          {isUp ? "📈 +" : "📉 "}
          {profit.toLocaleString()}원 ({profitRate.toFixed(1)}%)
        </Profit>
      </AssetSection>
      <Row>
        <Label>보유 종목</Label>
        <Value>{stockCount}개</Value>
      </Row>

      <Row>
        <Label>현재 평가금액</Label>
        <Value>{evaluationAmount.toLocaleString()}원</Value>
      </Row>

      <Divider />
    </Card>
  );
};

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
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
  font-weight: 600;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.background};
  margin: 8px 0;
`;

const Badge = styled.div`
  align-self: flex-start;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
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
  font-size: 24px;
  font-weight: 800;
`;

const Profit = styled.span<{ $isUp: boolean }>`
  font-size: 14px;
  font-weight: 700;

  color: ${({ theme, $isUp }) => ($isUp ? theme.colors.up : theme.colors.down)};
`;

export default PortfolioSummaryCard;
