//총자산 요약 카드

import styled from "styled-components";
import { usePortfolio } from "../../context/PortfolioContext";
import { companyMeta } from "../../data/companyMeta";

const BASE_MONEY = 100000; //초기 사이버 머니(고정값)
const PortfolioSummaryCard = () => {
  const { items } = usePortfolio();
  const { canBuyToday } = usePortfolio();

  //보유 종목 수
  const stockCount = items.length;

  //현재 평가 금액
  const evaluationAmount = items.reduce((total, item) => {
    const currentPrice = companyMeta[item.id].price; //보유수량*현재가격
    return total + currentPrice * item.quantity; //모든주식 합산
  }, 0);

  //총 자산 = 초기머니(BASE_MONEY) +현재 평가 금액(evaluationAmount)
  const totalAsset = BASE_MONEY + evaluationAmount;

  return (
    <Card>
      {/* 오늘의한번 뱃지🎖️*/}
      {!canBuyToday && <Badge>오늘의 한 번 🎖️</Badge>}
      <Row>
        <Label>보유 종목</Label>
        <Value>{stockCount}개</Value>
      </Row>

      <Row>
        <Label>현재 평가금액</Label>
        <Value>{evaluationAmount.toLocaleString()}원</Value>
      </Row>

      <Divider />

      <Row>
        <TotalLabel>총 자산</TotalLabel>
        <TotalValue>{totalAsset.toLocaleString()}원</TotalValue>
      </Row>
    </Card>
  );
};

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

const TotalLabel = styled.span`
  font-size: 15px;
  font-weight: 700;
`;

const TotalValue = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
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

export default PortfolioSummaryCard;
