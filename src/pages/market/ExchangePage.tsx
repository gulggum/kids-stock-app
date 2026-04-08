// src/pages/ExchangePage.tsx
// 환전 상점 페이지 — 원화 ↔ 달러 환전
// 아이들이 은행에서 환전하는 경험을 할 수 있는 페이지

import styled, { keyframes } from "styled-components";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { useExchangeRate } from "../../hooks/useExchangeRate";
import { useModal } from "../../context/UIContext/ModalContext";

// 환전 단위 버튼 목록
const EXCHANGE_OPTIONS = [
  { dollars: 10, label: "$10", emoji: "💵" },
  { dollars: 50, label: "$50", emoji: "💵" },
  { dollars: 100, label: "$100", emoji: "💴" },
  { dollars: 500, label: "$500", emoji: "💶" },
];

const ExchangePage = () => {
  const { user, exchangeToUsd, exchangeToKrw } = useUser();
  const exchangeRate = useExchangeRate();
  const { openModal } = useModal();

  const [selected, setSelected] = useState<number | null>(null); // 선택한 달러 금액
  const [mode, setMode] = useState<"BUY" | "SELL">("BUY"); // 환전 방향
  const [showEffect, setShowEffect] = useState(false);

  // 선택한 달러 기준 원화 계산
  const krwAmount = selected ? selected * exchangeRate : 0;

  // 환전 실행
  const handleExchange = () => {
    if (!selected) return;

    if (mode === "BUY") {
      // 원화 → 달러
      if (user.money < krwAmount) {
        openModal({
          type: "INFO",
          title: "원화가 부족해요 🥲",
          message: `${krwAmount.toLocaleString()}원이 필요해요!`,
          confirmText: "알겠어요",
        });
        return;
      }
      openModal({
        type: "CONFIRM",
        title: "환전할까요? 💱",
        customContent: (
          <ExchangeSummary>
            <SummaryRow>
              <SummaryLabel>💸 내는 돈</SummaryLabel>
              <SummaryValue>{krwAmount.toLocaleString()}원</SummaryValue>
            </SummaryRow>
            <SummaryArrow>⬇️</SummaryArrow>
            <SummaryRow>
              <SummaryLabel>💵 받는 돈</SummaryLabel>
              <SummaryValue $highlight>${selected}</SummaryValue>
            </SummaryRow>
            <SummaryRate>
              환율 1달러 = {exchangeRate.toLocaleString()}원
            </SummaryRate>
          </ExchangeSummary>
        ),
        confirmText: "환전하기",
        cancelText: "취소",
        onConfirm: () => {
          exchangeToUsd(krwAmount, selected!); // 원화 차감 + 달러 추가 한 번에
          triggerEffect();
        },
      });
    } else {
      // 달러 → 원화
      if ((user.dollars ?? 0) < selected) {
        openModal({
          type: "INFO",
          title: "달러가 부족해요 🥲",
          message: `$${selected}가 필요해요!`,
          confirmText: "알겠어요",
        });
        return;
      }
      openModal({
        type: "CONFIRM",
        title: "환전할까요? 💱",
        customContent: (
          <ExchangeSummary>
            <SummaryRow>
              <SummaryLabel>💵 내는 돈</SummaryLabel>
              <SummaryValue>${selected}</SummaryValue>
            </SummaryRow>
            <SummaryArrow>⬇️</SummaryArrow>
            <SummaryRow>
              <SummaryLabel>🇰🇷 받는 돈</SummaryLabel>
              <SummaryValue $highlight>
                {krwAmount.toLocaleString()}원
              </SummaryValue>
            </SummaryRow>
            <SummaryRate>
              환율 1달러 = {exchangeRate.toLocaleString()}원
            </SummaryRate>
          </ExchangeSummary>
        ),
        confirmText: "환전하기",
        cancelText: "취소",
        onConfirm: () => {
          exchangeToKrw(selected!, krwAmount); // 달러 차감 + 원화 추가 한 번에
          triggerEffect();
        },
      });
    }
  };

  const triggerEffect = () => {
    setShowEffect(true);
    setTimeout(() => setShowEffect(false), 1000);
    setSelected(null);
  };

  return (
    <Wrapper>
      {/* 🏦 은행 헤더 */}
      <BankHeader>
        <BankEmoji>🏦</BankEmoji>
        <BankTitle>KidsStock 환전 은행</BankTitle>
        <BankSubtitle>
          원화를 달러로, 달러를 원화로 바꿀 수 있어요!
        </BankSubtitle>
      </BankHeader>
      {/* 💡 교육 안내 */}
      <GuideCard>
        <GuideTitle>💡 환율이 뭐예요?</GuideTitle>
        <GuideText>
          나라마다 쓰는 돈이 달라요. 미국은 달러($), 한국은 원(₩)을 써요. 환율은
          두 나라 돈을 바꾸는 비율이에요. 오늘은 $1 ={" "}
          {exchangeRate.toLocaleString()}원이에요!
        </GuideText>
      </GuideCard>

      {/* 💰 내 지갑 현황 */}
      <WalletCard>
        <WalletRow>
          <WalletItem>
            <WalletLabel>🇰🇷 원화</WalletLabel>
            <WalletValue>{user.money.toLocaleString()}원</WalletValue>
          </WalletItem>
          <ArrowIcon>⇄</ArrowIcon>
          <WalletItem>
            <WalletLabel>🇺🇸 달러</WalletLabel>
            <WalletValue>${(user.dollars ?? 0).toLocaleString()}</WalletValue>
          </WalletItem>
        </WalletRow>
      </WalletCard>

      {/* 📊 환율 정보 */}
      <RateCard>
        <RateText>💱 오늘 환율</RateText>
        <RateValue>$1 = {exchangeRate.toLocaleString()}원</RateValue>
      </RateCard>

      {/* 🔄 환전 방향 토글 */}
      <ModeToggle>
        <ModeButton $active={mode === "BUY"} onClick={() => setMode("BUY")}>
          🇰🇷 원화 → 달러 🇺🇸
        </ModeButton>
        <ModeButton $active={mode === "SELL"} onClick={() => setMode("SELL")}>
          🇺🇸 달러 → 원화 🇰🇷
        </ModeButton>
      </ModeToggle>

      {/* 💵 금액 선택 */}
      <SectionTitle>얼마나 바꿀까요?</SectionTitle>
      <OptionGrid>
        {EXCHANGE_OPTIONS.map((opt) => (
          <OptionButton
            key={opt.dollars}
            $selected={selected === opt.dollars}
            onClick={() => setSelected(opt.dollars)}
          >
            <OptionEmoji>{opt.emoji}</OptionEmoji>
            <OptionLabel>{opt.label}</OptionLabel>
            <OptionSub>
              {mode === "BUY"
                ? `${(opt.dollars * exchangeRate).toLocaleString()}원`
                : `${(opt.dollars * exchangeRate).toLocaleString()}원`}
            </OptionSub>
          </OptionButton>
        ))}
      </OptionGrid>

      {/* 💡 계산 결과 */}
      {selected && (
        <ResultCard>
          {mode === "BUY" ? (
            <>
              <ResultText>💸 {krwAmount.toLocaleString()}원을 내면</ResultText>
              <ResultHighlight>${selected}를 받아요!</ResultHighlight>
            </>
          ) : (
            <>
              <ResultText>💵 ${selected}를 내면</ResultText>
              <ResultHighlight>
                {krwAmount.toLocaleString()}원을 받아요!
              </ResultHighlight>
            </>
          )}
        </ResultCard>
      )}

      {/* 🔘 환전 버튼 */}
      <ExchangeButton disabled={!selected} onClick={handleExchange}>
        {selected ? `💱 환전하기` : "금액을 선택해주세요"}
      </ExchangeButton>

      {/* ✨ 환전 완료 이펙트 */}
      {showEffect && <Effect>💱 환전 완료!</Effect>}
    </Wrapper>
  );
};

export default ExchangePage;

/* ================= 스타일 ================= */

const float = keyframes`
  0% { opacity: 0; transform: translateY(0) scale(0.8); }
  50% { opacity: 1; transform: translateY(-20px) scale(1.1); }
  100% { opacity: 0; transform: translateY(-40px) scale(1); }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
  position: relative;
`;

const BankHeader = styled.div`
  text-align: center;
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

const BankEmoji = styled.div`
  font-size: 48px;
  margin-bottom: 8px;
`;

const BankTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 22px;
  margin-bottom: 6px;
`;

const BankSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const WalletCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
`;

const WalletRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const WalletItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const WalletLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const WalletValue = styled.span`
  font-size: 20px;
  font-weight: 800;
`;

const ArrowIcon = styled.span`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.primary};
`;

const RateCard = styled.div`
  background: ${({ theme }) => theme.colors.primary}15;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RateText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RateValue = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const ModeToggle = styled.div`
  display: flex;
  gap: 8px;
`;

const ModeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ $active }) => ($active ? "#fff" : "inherit")};
  transition: all 0.15s ease;
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const OptionButton = styled.button<{ $selected: boolean }>`
  padding: 16px 12px;
  border: 2px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary + "15" : theme.colors.surface};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.15s ease;
  &:active {
    transform: scale(0.97);
  }
`;

const OptionEmoji = styled.span`
  font-size: 24px;
`;
const OptionLabel = styled.span`
  font-size: 18px;
  font-weight: 800;
`;
const OptionSub = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ResultCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ResultText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ResultHighlight = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const ExchangeButton = styled.button<{ disabled: boolean }>`
  padding: 16px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: 16px;
  font-weight: 800;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.muted : theme.colors.primary};
  color: white;
  transition: all 0.15s ease;
  &:active {
    transform: ${({ disabled }) => (disabled ? "none" : "scale(0.97)")};
  }
`;

const Effect = styled.div`
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  animation: ${float} 1s ease forwards;
  pointer-events: none;
  z-index: 100;
`;

const GuideCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GuideTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

const GuideText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;
const ExchangeSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 4px 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const SummaryLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SummaryValue = styled.span<{ $highlight?: boolean }>`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.primary : theme.colors.text};
`;

const SummaryArrow = styled.div`
  font-size: 20px;
`;

const SummaryRate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 4px;
`;
