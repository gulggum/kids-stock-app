import styled, { keyframes } from "styled-components";
import StockGuideModal from "./StockGuideModal";

type GuideChecks = {
  rule1: boolean;
  rule2: boolean;
  rule3: boolean;
  rule4: boolean;
};

/**
 * 📌 BuySellSection Props
 * - StockDetail에서 내려주는 값들
 */
type Props = {
  /** 가이드 모달 열림 여부 */
  showGuideModal: boolean;

  /** 가이드 모달 상태 변경 */
  setShowGuideModal: (v: boolean) => void;

  /** 체크 상태 */
  checks: GuideChecks;

  /** 체크 토글 함수 */
  toggleCheck: (key: keyof GuideChecks) => void;

  /** 전체 체크 완료 여부 */
  isAllChecked: boolean;

  /** 오늘 구매 여부 */
  hasBoughtToday: boolean;

  /** 구매 버튼 클릭 */
  handleBuyClick: () => void;

  /** 실제 구매 실행 */
  handleBuyConfirm: () => void;

  /** 판매 버튼 클릭 */
  handleSellClick: () => void;

  /** 구매 이펙트 */
  showMoneyEffect: boolean;

  /** 판매 이펙트 */
  showSellEffect: boolean;

  /** 가격 */
  price: number;

  /** 회사 이름 */
  companyName: string;
};

const BuySellSection = ({
  showGuideModal,
  setShowGuideModal,
  checks,
  toggleCheck,
  isAllChecked,
  hasBoughtToday,
  handleBuyClick,
  handleBuyConfirm,
  handleSellClick,
  showMoneyEffect,
  showSellEffect,
  price,
}: Props) => {
  return (
    <Wrapper>
      {/* 📌 가이드 모달 */}
      <StockGuideModal
        open={showGuideModal}
        onClose={() => {
          setShowGuideModal(false);
        }}
        checks={checks}
        toggleCheck={toggleCheck}
        isAllChecked={isAllChecked}
      />

      {/* 🛒 구매 버튼 */}
      <BuyButton disabled={hasBoughtToday} onClick={handleBuyClick}>
        {hasBoughtToday ? "오늘 구매 완료 🌙" : "이 주식 구매하기 🛒"}
      </BuyButton>

      {/* 💸 판매 버튼 */}
      <SellButton onClick={handleSellClick}>보유 주식 판매 💸</SellButton>

      {/* 💰 구매 이펙트 */}
      {showMoneyEffect && (
        <MoneyEffect>💰 -{price.toLocaleString()}</MoneyEffect>
      )}

      {/* 💵 판매 이펙트 */}
      {showSellEffect && <SellEffect>💵 +{price.toLocaleString()}</SellEffect>}
    </Wrapper>
  );
};

export default BuySellSection;

/* 스타일 */

const floatUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.9);
  }
  20% {
    opacity: 1;
    transform: translateY(-4px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-24px) scale(1.05);
  }
`;

const Wrapper = styled.div`
  position: relative;
  margin-top: 16px;
  display: flex;
  gap: 10px;
`;

const BuyButton = styled.button<{ disabled?: boolean }>`
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};

  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.muted : theme.colors.primary};

  color: white;
  font-size: 15px;
  font-weight: 800;
  min-width: 0;

  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  transition: all 0.15s ease;

  &:active {
    transform: ${({ disabled }) => (disabled ? "none" : "scale(0.97)")};
  }
`;

const SellButton = styled.button`
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};

  background: ${({ theme }) => theme.colors.secondary};
  color: white;

  font-size: 15px;
  font-weight: 800;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  cursor: pointer;
  transition: all 0.15s ease;

  &:active {
    transform: scale(0.97);
  }
`;

const MoneyEffect = styled.div`
  position: absolute;
  left: 30%;
  top: -8px;
  transform: translateX(-50%);

  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};

  pointer-events: none;

  animation: ${floatUp} 0.9s ease-out;
`;

const SellEffect = styled.div`
  position: absolute;
  right: 10px;
  top: -10px;

  font-weight: 800;
  color: ${({ theme }) => theme.colors.up};

  animation: moneyFloat 1.2s ease forwards;

  @keyframes moneyFloat {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-25px);
    }
  }
`;
