// 📌 StockDetailHeader
// - 페이지 최상단 sticky 영역
// - 뒤로가기 버튼 + 내가 가진 돈 표시 (감소 애니메이션 포함)

import styled from "styled-components";
import { useUser } from "../../context/UserContext";

type Props = {
  money: number;
  animateMoney: boolean;
  onBack: () => void;
  country?: "KR" | "US";
};

const StockDetailHeader = ({ money, animateMoney, onBack, country }: Props) => {
  const { user } = useUser();
  const isUS = country === "US";

  return (
    <StickyHeader>
      <BackButton onClick={onBack} aria-label="이전 페이지로 돌아가기">
        ← 돌아가기
      </BackButton>

      <MoneyBar
        className={animateMoney ? "decrease" : ""}
        role="status"
        aria-live="polite"
      >
        <MoneyItem>
          <MoneyLabel>🇰🇷 원화</MoneyLabel>
          <MoneyAmount>{money.toLocaleString()}원</MoneyAmount>
        </MoneyItem>

        {isUS && (
          <>
            <Divider />
            <MoneyItem>
              <MoneyLabel>🇺🇸 달러</MoneyLabel>
              <MoneyAmount $isDollar>
                ${(user.dollars ?? 0).toLocaleString()}
              </MoneyAmount>
            </MoneyItem>
          </>
        )}
      </MoneyBar>
    </StickyHeader>
  );
};

export default StockDetailHeader;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const BackButton = styled.button`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    transform 0.15s ease,
    background 0.15s ease;
  &:hover {
    background: ${({ theme }) => theme.colors.card};
    transform: translateX(-2px);
  }
  &:active {
    transform: scale(0.96);
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const MoneyBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.card};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.18s ease;
  &.decrease {
    transform: scale(0.97);
  }
`;

const MoneyItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
`;

const MoneyLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MoneyAmount = styled.strong<{ $isDollar?: boolean }>`
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme, $isDollar }) =>
    $isDollar ? theme.colors.accentGreen : theme.colors.primary};
`;

const Divider = styled.div`
  width: 1px;
  height: 36px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 8px;
`;
