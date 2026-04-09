import styled, { keyframes } from "styled-components";
import StockGuideModal from "./StockGuideModal";
import { useModal } from "../../context/UIContext/ModalContext";
import TradeSummary from "./TradeSummary";
import type { Company } from "../../hooks/useStockDetail";

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
  showGuideModal: boolean; /** 가이드 모달 열림 여부 */
  setShowGuideModal: (v: boolean) => void; /** 가이드 모달 상태 변경 */
  checks: GuideChecks; /** 체크 상태 */
  toggleCheck: (key: keyof GuideChecks) => void; /** 체크 토글 함수 */
  isAllChecked: boolean; /** 전체 체크 완료 여부 */
  hasBoughtToday: boolean; /** 오늘 구매 여부 */
  handleBuyClick: () => void; /** 구매 버튼 클릭 */
  handleBuyConfirm: () => void; /** 실제 구매 실행 */
  handleSellClick: () => void; /** 판매 버튼 클릭 */
  showMoneyEffect: boolean; /** 구매 이펙트 */
  /** 판매 이펙트 */
  showSellEffect: boolean;
  company: Company; //회사정보
  //내가보유한 금액
  myMoney: number;
  myDollars?: number;
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
  company,
  myMoney,
  myDollars,
}: Props) => {
  const { openModal } = useModal();

  return (
    <Wrapper>
      {/* 📌 가이드 모달 */}
      <StockGuideModal
        open={showGuideModal}
        onClose={() => {
          setShowGuideModal(false);

          // 👉 가이드 닫고 나서 구매 확인 모달
          openModal({
            type: "CONFIRM",
            title: "구매할까요?",
            customContent: (
              <TradeSummary
                type="BUY"
                name={company.name}
                money={company.country === "US" ? (myDollars ?? 0) : myMoney}
                price={company.price}
                country={company.country}
              />
            ),
            confirmText: "구매",
            cancelText: "아니오",
            onConfirm: handleBuyConfirm,
          });
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
        <MoneyEffect>
          {company.country === "US"
            ? `💰 -$${company.price.toLocaleString()}`
            : `💰 -${myMoney.toLocaleString()}원`}
        </MoneyEffect>
      )}

      {/* 💵 판매 이펙트 */}
      {showSellEffect && (
        <SellEffect>
          {company.country === "US"
            ? `💵 +$${company.price.toLocaleString()}`
            : `💵 +${myMoney.toLocaleString()}원`}
        </SellEffect>
      )}
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
