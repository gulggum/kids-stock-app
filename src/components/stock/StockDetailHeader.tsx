// 📌 StockDetailHeader
// - 페이지 최상단 sticky 영역
// - 뒤로가기 버튼 + 내가 가진 돈 표시 (감소 애니메이션 포함)

import styled from "styled-components";
import WalletBalanceBar from "./WalletBalanceBar";

type Props = {
  money: number;
  animateMoney: boolean;
  onBack: () => void;
  country?: "KR" | "US";
};

const StockDetailHeader = ({ onBack }: Props) => {
  return (
    <StickyHeader>
      <BackButton onClick={onBack} aria-label="이전 페이지로 돌아가기">
        ← 돌아가기
      </BackButton>
      <WalletBalanceBar />
    </StickyHeader>
  );
};

export default StockDetailHeader;

const StickyHeader = styled.div`
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
