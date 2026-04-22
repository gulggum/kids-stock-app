import { useState } from "react";
import styled from "styled-components";

/**
 * 📌 TradeSummary
 * - 구매 / 판매 요약 UI
 * - ModalPopup customContent용
 * - BUY일 때 투자 이유 선택 포함
 * - onReasonChange로 선택한 이유를 부모에 전달
 */

export const REASONS = [
  { emoji: "📰", label: "뉴스에서 봤어요" },
  { emoji: "😍", label: "이 회사 제품을 좋아해요" },
  { emoji: "🔥", label: "친구들이 사서요" },
  { emoji: "🤔", label: "그냥 궁금해서요" },
];
export const PRESET_REASONS = REASONS.map((r) => r.label);

type Props = {
  type: "BUY" | "SELL";
  money: number;
  price: number;
  name: string;
  buyPrice?: number; //평균 매수가
  country?: "KR" | "US";
  onReasonChange?: (reason: string) => void;
  onQuantityChange?: (qty: number) => void;
};

const TradeSummary = ({
  type,
  money,
  price,
  name,
  buyPrice,
  country,
  onReasonChange,
  onQuantityChange,
}: Props) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [quantity, setQuantity] = useState(1); //구매수량

  const isUS = country === "US";
  const fmt = (n: number) =>
    isUS ? `$${n.toLocaleString()}` : `${Math.round(n).toLocaleString()}원`;

  const totalPrice = price * quantity;
  const afterMoney = type === "BUY" ? money - totalPrice : money + totalPrice;
  // 수익 계산
  const profit = buyPrice !== undefined ? price - buyPrice : 0;

  // 수익률
  const profitRate = buyPrice ? (profit / buyPrice) * 100 : 0;

  //선택이유
  const handleSelectReason = (label: string) => {
    setSelectedReason(label);
    setShowCustom(false);
    setCustomReason("");
    onReasonChange?.(label);
  };

  const handleCustomChange = (value: string) => {
    setCustomReason(value);
    onReasonChange?.(value);
  };

  // 수량 변경 핸들러
  const handleQuantity = (v: number) => {
    const maxQty = Math.floor(money / price); // 살 수 있는 최대 수량
    const next = Math.min(Math.max(v, 1), maxQty);
    setQuantity(next);
    onQuantityChange?.(next);
  };
  return (
    <Wrapper>
      <Header>
        <Section>
          <CompanyName>{name}</CompanyName>
          {/* 수량 선택 */}
          {type === "BUY" && (
            <QuantityRow>
              <QuantityBtn onClick={() => handleQuantity(quantity - 1)}>
                -
              </QuantityBtn>
              <QuantityNum>{quantity}주</QuantityNum>
              <QuantityBtn onClick={() => handleQuantity(quantity + 1)}>
                +
              </QuantityBtn>
            </QuantityRow>
          )}

          {/* 구매금액 아래로 분리 */}
          <AmountInfo>
            <Label>{type === "BUY" ? "구매 금액" : "판매 금액"}</Label>
            <Amount $type={type}>
              {type === "BUY" ? "-" : "+"}
              {fmt(totalPrice)}
            </Amount>
          </AmountInfo>
        </Section>
      </Header>

      {/* 💸 거래 금액 */}
      {/* 💰 현재 돈 */}
      <Section>
        <Label>나의 {isUS ? "달러" : "원화"} 잔고</Label>
        <MoneyRow>
          <Before>{fmt(money)}</Before>
          <Arrow>→</Arrow>
          <After>{fmt(afterMoney)}</After>
        </MoneyRow>
      </Section>

      {/* 판매 수익 */}
      {type === "SELL" && buyPrice !== undefined && (
        <AmountGroup>
          <Section>
            <Label>수익</Label>
            <Amount $type={profit >= 0 ? "SELL" : "BUY"}>
              {profit >= 0 ? "+" : ""}
              {fmt(profit)} 💰
            </Amount>
          </Section>
          <Section>
            <Label>수익률</Label>
            <Rate $positive={profit >= 0}>
              {profit >= 0 ? "+" : ""}
              {profitRate.toFixed(1)}%
            </Rate>
          </Section>
        </AmountGroup>
      )}

      {type === "SELL" && (
        <Notice>💡 판매한 {isUS ? "달러" : "돈"}는 2일 뒤에 들어와요</Notice>
      )}

      {/* 투자 이유 선택 — BUY일 때만 표시 */}
      {type === "BUY" && (
        <ReasonSection>
          <ReasonTitle>잠깐! 🤔 왜 이 회사 주식을 사려고 하나요?</ReasonTitle>
          <ReasonList>
            {REASONS.map((r) => (
              <ReasonButton
                key={r.label}
                $selected={selectedReason === r.label}
                onClick={() => handleSelectReason(r.label)}
              >
                <ReasonEmoji>{r.emoji}</ReasonEmoji>
                <ReasonLabel>{r.label}</ReasonLabel>
              </ReasonButton>
            ))}
            <ReasonButton
              $selected={showCustom}
              onClick={() => {
                setShowCustom(true);
                setSelectedReason("");
              }}
            >
              <ReasonEmoji>✏️</ReasonEmoji>
              <ReasonLabel>직접 써볼게요</ReasonLabel>
            </ReasonButton>
          </ReasonList>

          {showCustom && (
            <CustomInput
              placeholder="내 생각을 적어봐요 ✍️"
              value={customReason}
              onChange={(e) => handleCustomChange(e.target.value)}
              maxLength={50}
            />
          )}
        </ReasonSection>
      )}
    </Wrapper>
  );
};

export default TradeSummary;

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
  gap: 12px;
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

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const Label = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
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
const AmountGroup = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 10px 0;
  border-radius: ${({ theme }) => theme.radius.md};

  background: ${({ theme }) => theme.colors.surface};
`;

const Amount = styled.div<{ $type: "BUY" | "SELL" }>`
  font-size: 16px;
  font-weight: 800;

  color: ${({ $type }) => ($type === "BUY" ? "#e53935" : "#4caf50")};
`;

const Rate = styled.div<{ $positive: boolean }>`
  font-size: 15px;
  font-weight: 800;

  color: ${({ $positive }) => ($positive ? "#4caf50" : "#e53935")};
`;

const Notice = styled.div`
  margin-top: 6px;
  font-size: 12px;

  color: ${({ theme }) => theme.colors.textSecondary};

  text-align: center;
`;
const ReasonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 4px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;
const ReasonTitle = styled.div`
  margin-top: 10px;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`;
const ReasonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const ReasonButton = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 8px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 2px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary + "15" : theme.colors.surface};
  cursor: pointer;
  transition: all 0.15s ease;
  &:active {
    transform: scale(0.97);
  }
`;
const ReasonEmoji = styled.span`
  font-size: 20px;
`;
const ReasonLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.text};
`;
const CustomInput = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  font-size: 13px;
  font-family: inherit;
  resize: none;
  height: 70px;
  outline: none;
  color: ${({ theme }) => theme.colors.text};
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }
`;
// 스타일 추가
const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 4px 0;
`;

const QuantityBtn = styled.button`
  width: 32px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:active {
    transform: scale(0.95);
  }
`;

const QuantityNum = styled.div`
  font-size: 20px;
  font-weight: 800;
  min-width: 40px;
  text-align: center;
`;
