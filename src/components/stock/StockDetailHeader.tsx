// 📌 StockDetailHeader
// - 페이지 최상단 sticky 영역
// - 뒤로가기 버튼 + 내가 가진 돈 표시 (감소 애니메이션 포함)

import styled from "styled-components";

type Props = {
  money: number;
  animateMoney: boolean;
  onBack: () => void;
};

const StockDetailHeader = ({ money, animateMoney, onBack }: Props) => (
  <StickyHeader>
    <BackButton onClick={onBack}>← 돌아가기</BackButton>
    <MoneyBar className={animateMoney ? "decrease" : ""}>
      <MoneyLabel>💰 내가 가진 돈</MoneyLabel>
      <MoneyAmount>{money.toLocaleString()}</MoneyAmount>
    </MoneyBar>
  </StickyHeader>
);

export default StockDetailHeader;

//헤더 고정영역
const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;

  padding: 12px 16px;

  display: flex;
  flex-direction: column;
  gap: 8px;
  backdrop-filter: blur(6px);

  /* 아래 콘텐츠와 구분감 */
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const BackButton = styled.button`
  align-self: flex-start;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  color: ${({ theme }) => theme.colors.text};

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  box-shadow: ${({ theme }) => theme.shadows.sm};

  transition:
    background 0.15s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.card};
    transform: translateX(-2px); /* ← 느낌 */
  }

  &:active {
    transform: translateX(0) scale(0.97);
    box-shadow: none;
  }
`;
const MoneyBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.lg};

  background: ${({ theme }) => theme.colors.card};

  box-shadow: ${({ theme }) => theme.shadows.md};

  font-size: 14px;
  font-weight: 700;

  transition: transform 0.18s ease;

  &.decrease {
    transform: scale(0.95);
  }
`;
const MoneyLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 17px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const MoneyAmount = styled.strong`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;
