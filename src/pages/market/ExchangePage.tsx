// src/pages/ExchangePage.tsx
// 환전 상점 페이지 — 원화 ↔ 달러 환전
// 아이들이 은행에서 환전하는 경험을 할 수 있는 페이지

import styled, { keyframes } from "styled-components";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { useExchangeRate } from "../../hooks/useExchangeRate";
import { useModal } from "../../context/UIContext/ModalContext";
import { useExchangeHistory } from "../../hooks/useExchangeHistory";

// 환전 단위 버튼 목록
const EXCHANGE_OPTIONS = [
  { dollars: 10, label: "$10", emoji: "💵" },
  { dollars: 50, label: "$50", emoji: "💵" },
  { dollars: 100, label: "$100", emoji: "💴" },
  { dollars: 500, label: "$500", emoji: "💶" },
];
type TabType = "EXCHANGE" | "HISTORY";

const ExchangePage = () => {
  const { user, exchangeToUsd, exchangeToKrw } = useUser();
  const exchangeRate = useExchangeRate();
  const { openModal } = useModal();
  const {
    history,
    loading: historyLoading,
    saveExchange,
  } = useExchangeHistory();

  const [selected, setSelected] = useState<number | null>(null);
  const [mode, setMode] = useState<"BUY" | "SELL">("BUY");
  const [tab, setTab] = useState<TabType>("EXCHANGE");
  const [showEffect, setShowEffect] = useState(false);

  const krwAmount = selected ? Math.round(selected * exchangeRate) : 0;

  const handleExchange = () => {
    if (!selected) return;

    if (mode === "BUY" && user.money < krwAmount) {
      openModal({
        type: "INFO",
        title: "원화가 부족해요 🥲",
        message: `${krwAmount.toLocaleString()}원이 필요해요!`,
        confirmText: "알겠어요",
      });
      return;
    }

    if (mode === "SELL" && (user.dollars ?? 0) < selected) {
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
            <SummaryLabel>
              {mode === "BUY" ? "💸 내는 돈" : "💵 내는 달러"}
            </SummaryLabel>
            <SummaryValue>
              {mode === "BUY"
                ? `${krwAmount.toLocaleString()}원`
                : `$${selected}`}
            </SummaryValue>
          </SummaryRow>
          <SummaryArrow>⬇️</SummaryArrow>
          <SummaryRow>
            <SummaryLabel>
              {mode === "BUY" ? "💵 받는 달러" : "💸 받는 돈"}
            </SummaryLabel>
            <SummaryValue $highlight>
              {mode === "BUY"
                ? `$${selected}`
                : `${krwAmount.toLocaleString()}원`}
            </SummaryValue>
          </SummaryRow>
          <SummaryRate>
            환율 1달러 = {exchangeRate.toLocaleString()}원
          </SummaryRate>
        </ExchangeSummary>
      ),
      confirmText: "환전하기",
      cancelText: "취소",
      onConfirm: async () => {
        // ✅ 환전 먼저, 저장은 나중에
        if (mode === "BUY") {
          exchangeToUsd(krwAmount, selected!); // 동기
        } else {
          exchangeToKrw(selected!, krwAmount); // 동기
        }

        setShowEffect(true);
        setTimeout(() => setShowEffect(false), 1000);
        setSelected(null);

        // DB 저장은 비동기로 따로
        if (mode === "BUY") {
          saveExchange("BUY", selected!, krwAmount, exchangeRate);
        } else {
          saveExchange("SELL", selected!, krwAmount, exchangeRate);
        }
      },
    });
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

      {/* 환율 */}
      <RateCard>
        <RateText>💱 오늘 환율</RateText>
        <RateValue>$1 = {exchangeRate.toLocaleString()}원</RateValue>
      </RateCard>

      {/* 내 지갑 */}
      <WalletCard>
        <WalletRow>
          <WalletItem>
            <WalletLabel>🇰🇷 원화</WalletLabel>
            <WalletValue>{user.money.toLocaleString()}원</WalletValue>
          </WalletItem>
          <ArrowIcon>⇄</ArrowIcon>
          <WalletItem>
            <WalletLabel>🇺🇸 달러</WalletLabel>
            <WalletValue $isDollar>
              ${(user.dollars ?? 0).toLocaleString()}
            </WalletValue>
          </WalletItem>
        </WalletRow>
      </WalletCard>

      {/* 탭 */}
      <TabBar>
        <TabButton
          $active={tab === "EXCHANGE"}
          onClick={() => setTab("EXCHANGE")}
        >
          💱 환전하기
        </TabButton>
        <TabButton
          $active={tab === "HISTORY"}
          onClick={() => setTab("HISTORY")}
        >
          📋 환전 내역
        </TabButton>
      </TabBar>

      {/* ── 환전 탭 ── */}
      {tab === "EXCHANGE" && (
        <>
          {/* 금액 선택 */}
          <SectionTitle>얼마나 바꿀까요?</SectionTitle>
          {/* 방향 토글 */}
          <ModeToggle>
            <ModeButton $active={mode === "BUY"} onClick={() => setMode("BUY")}>
              🇰🇷 원화 → 달러 🇺🇸
            </ModeButton>
            <ModeButton
              $active={mode === "SELL"}
              onClick={() => setMode("SELL")}
            >
              🇺🇸 달러 → 원화 🇰🇷
            </ModeButton>
          </ModeToggle>

          <OptionGrid>
            {EXCHANGE_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.dollars}
                $selected={selected === opt.dollars}
                onClick={() => setSelected(opt.dollars)}
              >
                <OptionEmoji>{opt.emoji}</OptionEmoji>
                <OptionLabel>${opt.dollars}</OptionLabel>
                <OptionSub>
                  {(opt.dollars * exchangeRate).toLocaleString()}원
                </OptionSub>
              </OptionButton>
            ))}
          </OptionGrid>

          {/* 계산 결과 */}
          {selected && (
            <ResultCard>
              {mode === "BUY" ? (
                <>
                  <ResultText>
                    💸 {krwAmount.toLocaleString()}원을 내면
                  </ResultText>
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

          <ExchangeButton disabled={!selected} onClick={handleExchange}>
            {selected ? "💱 환전하기" : "금액을 선택해주세요"}
          </ExchangeButton>
          {/* 💡 교육 안내 */}
          <GuideCard>
            <GuideTitle>💡 환율이 뭐예요?</GuideTitle>
            <GuideText>
              나라마다 쓰는 돈이 달라요. 미국은 달러($), 한국은 원(₩)을 써요.
              <br />
              환율은 두 나라 돈을 바꾸는 비율이에요. <br />
              오늘은 $1 = {exchangeRate.toLocaleString()}원이에요!
            </GuideText>
          </GuideCard>
          {showEffect && <Effect>💱 환전 완료!</Effect>}
        </>
      )}

      {/* ── 환전 내역 탭 ── */}
      {tab === "HISTORY" && (
        <HistorySection>
          {historyLoading ? (
            <EmptyText>불러오는 중이에요...</EmptyText>
          ) : history.length === 0 ? (
            <EmptyText>아직 환전 내역이 없어요 🥲</EmptyText>
          ) : (
            history.map((record) => (
              <HistoryCard key={record.id}>
                <HistoryLeft>
                  <HistoryType $isBuy={record.type === "BUY"}>
                    {record.type === "BUY" ? "🇰🇷 → 🇺🇸" : "🇺🇸 → 🇰🇷"}
                  </HistoryType>
                  <HistoryDate>
                    {new Date(record.created_at).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </HistoryDate>
                </HistoryLeft>
                <HistoryRight>
                  <HistoryAmount $isBuy={record.type === "BUY"}>
                    {record.type === "BUY"
                      ? `${record.krw.toLocaleString()}원 → $${record.dollars}`
                      : `$${record.dollars} → ${record.krw.toLocaleString()}원`}
                  </HistoryAmount>
                  <HistoryRate>
                    환율 {record.rate.toLocaleString()}원
                  </HistoryRate>
                </HistoryRight>
              </HistoryCard>
            ))
          )}
        </HistorySection>
      )}
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

const TabBar = styled.div`
  display: flex;
  gap: 8px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.secondary : theme.colors.surface};
  color: ${({ $active }) => ($active ? "#fff" : "inherit")};
  transition: all 0.15s ease;
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
const WalletValue = styled.span<{ $isDollar?: boolean }>`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme, $isDollar }) =>
    $isDollar ? theme.colors.accentGreen : theme.colors.primary};
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
  font-family: inherit;
  cursor: pointer;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ $active }) => ($active ? "#fff" : "inherit")};
  transition: all 0.15s ease;
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
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
  font-family: inherit;
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

const HistorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HistoryCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HistoryLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HistoryType = styled.span<{ $isBuy: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme, $isBuy }) =>
    $isBuy ? theme.colors.primary : theme.colors.accentGreen};
`;

const HistoryDate = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
`;

const HistoryRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const HistoryAmount = styled.span<{ $isBuy: boolean }>`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme, $isBuy }) =>
    $isBuy ? theme.colors.primary : theme.colors.accentGreen};
`;

const HistoryRate = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 40px 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 15px;
`;

const ExchangeSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
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
