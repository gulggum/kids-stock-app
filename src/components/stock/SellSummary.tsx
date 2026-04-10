// 판매 확인 모달 컴포넌트
// - 수량 조절 (1 ~ 보유수량)
// - 전부팔기 버튼
// - 실시간 수익/수익률 계산
// - onQuantityChange로 선택한 수량을 부모에 전달

import styled from "styled-components";
import { useState } from "react";

type Props = {
  name: string;
  price: number; // 현재 가격
  buyPrice: number; // 평균 매수가
  holdingQuantity: number; // 보유 수량
  money: number; // 현재 잔고
  country?: "KR" | "US";
  onQuantityChange: (qty: number) => void; // 수량 변경 시 부모에 전달
};

const SellSummary = ({
  name,
  price,
  buyPrice,
  holdingQuantity,
  money,
  country,
  onQuantityChange,
}: Props) => {
  const isUS = country === "US";
  const [quantity, setQuantity] = useState(1);

  const fmt = (n: number) =>
    isUS ? `$${n.toLocaleString()}` : `${Math.round(n).toLocaleString()}원`;

  // 수량 변경
  const handleChange = (qty: number) => {
    const clamped = Math.min(Math.max(qty, 1), holdingQuantity);
    setQuantity(clamped);
    onQuantityChange(clamped);
  };

  // 전부팔기
  const handleSellAll = () => {
    setQuantity(holdingQuantity);
    onQuantityChange(holdingQuantity);
  };

  // 계산
  const totalSellPrice = price * quantity;
  const totalBuyPrice = buyPrice * quantity;
  const profit = totalSellPrice - totalBuyPrice;
  const profitRate = (profit / totalBuyPrice) * 100;
  const afterMoney = money + totalSellPrice;
  const isUp = profit >= 0;

  return (
    <Wrapper>
      {/* 회사명 + 판매 금액 */}
      <Header>
        <CompanyName>{name}</CompanyName>
        <AmountInfo>
          <Label>판매 금액</Label>
          <Amount $positive>{fmt(totalSellPrice)} 💰</Amount>
        </AmountInfo>
      </Header>

      {/* 잔고 변화 */}
      <Section>
        <Label>나의 {isUS ? "달러" : "원화"} 잔고</Label>
        <MoneyRow>
          <Before>{fmt(money)}</Before>
          <Arrow>→</Arrow>
          <After>{fmt(afterMoney)}</After>
        </MoneyRow>
      </Section>

      {/* 수량 조절 */}
      <QuantitySection>
        <QuantityLabel>판매 수량</QuantityLabel>

        <QuantityRow>
          <QtyButton
            onClick={() => handleChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            −
          </QtyButton>
          <QtyDisplay>
            <QtyNumber>{quantity}</QtyNumber>
            <QtyUnit>주</QtyUnit>
          </QtyDisplay>
          <QtyButton
            onClick={() => handleChange(quantity + 1)}
            disabled={quantity >= holdingQuantity}
          >
            +
          </QtyButton>
          <SellAllButton onClick={handleSellAll}>
            전부팔기 <br />({holdingQuantity}주)
          </SellAllButton>
        </QuantityRow>
      </QuantitySection>

      {/* 수익 */}
      <ProfitGroup>
        <Section>
          <Label>수익</Label>
          <ProfitAmount $isUp={isUp}>
            {isUp ? "+" : ""}
            {fmt(profit)} 💰
          </ProfitAmount>
        </Section>
        <Section>
          <Label>수익률</Label>
          <ProfitRate $isUp={isUp}>
            {isUp ? "+" : ""}
            {profitRate.toFixed(1)}%
          </ProfitRate>
        </Section>
      </ProfitGroup>
      <InfoNote>
        <Title>
          <Icon>✋</Icon>
          잠깐!
        </Title>

        <Text>
          실제 주식에선 판매한 {isUS ? "달러" : "돈"}는 바로 들어오지 않고{" "}
          <strong>2일 뒤</strong>에 들어와요!
          <br />
          키즈스톡에서는 쉽게 체험할 수 있도록 바로 반영돼요 😊
        </Text>
      </InfoNote>
    </Wrapper>
  );
};

export default SellSummary;

/* ================= 스타일 ================= */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
`;

const CompanyName = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

const AmountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Label = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Amount = styled.div<{ $positive?: boolean }>`
  font-size: 16px;
  font-weight: 800;
  color: #4caf50;
`;

const QuantitySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const QuantityLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const QtyButton = styled.button<{ disabled?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid
    ${({ theme, disabled }) =>
      disabled ? theme.colors.border : theme.colors.primary};
  background: none;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.muted : theme.colors.primary};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  &:active {
    transform: ${({ disabled }) => (disabled ? "none" : "scale(0.93)")};
  }
`;

const QtyDisplay = styled.div`
  display: flex;
  align-items: baseline;
  gap: 3px;
  min-width: 48px;
  justify-content: center;
`;

const QtyNumber = styled.span`
  font-size: 24px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
`;

const QtyUnit = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const SellAllButton = styled.button`
  padding: 7px 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1.5px solid ${({ theme }) => theme.colors.down};
  background: ${({ theme }) => theme.colors.down}10;
  color: ${({ theme }) => theme.colors.down};
  font-size: 10px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
  &:active {
    transform: scale(0.97);
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const MoneyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const Before = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Arrow = styled.span`
  font-size: 14px;
`;

const After = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const ProfitGroup = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 10px 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
`;

const ProfitAmount = styled.div<{ $isUp: boolean }>`
  font-size: 16px;
  font-weight: 800;
  color: ${({ $isUp }) => ($isUp ? "#4caf50" : "#e53935")};
`;

const ProfitRate = styled.div<{ $isUp: boolean }>`
  font-size: 15px;
  font-weight: 800;
  color: ${({ $isUp }) => ($isUp ? "#4caf50" : "#e53935")};
`;
const InfoNote = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};

  background: rgba(59, 130, 246, 0.08);
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Icon = styled.span`
  font-size: 16px;
`;

const Text = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;
