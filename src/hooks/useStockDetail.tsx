import { useEffect, useRef, useState } from "react";
import { useTrade } from "../context/TradeContext";
import { useModal } from "../context/UIContext/ModalContext";
import { useReward } from "../context/RewardContext";
import { useUser } from "../context/UserContext";
import { getStorage, setStorage } from "../utils/storage";
import { playMoneySound } from "../utils/sounds";
import TradeSummary from "../components/stock/TradeSummary";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { usePortfolio } from "../context/PortfolioContext";
import SellSummary from "../components/stock/SellSummary";

/**
 * 📌 useStockDetail
 *
 * 역할: StockDetail 페이지의 상태 + 비즈니스 로직 전담
 * - UI와 로직을 분리해서 페이지는 "보여주는 역할"만 하게 만들기 위함
 *
 */

// ─────────────────────────────────────────
// 📌 타입 정의
// ─────────────────────────────────────────

// 구매 전 체크리스트 상태
type GuideChecks = {
  rule1: boolean;
  rule2: boolean;
  rule3: boolean;
  rule4: boolean;
};

// 회사 정보 (최소한만)
export type Company = {
  id: number;
  name: string;
  price: number;
  country?: "KR" | "US";
};

type UseStockDetailReturn = {
  period: "7d" | "30d";
  setPeriod: (v: "7d" | "30d") => void;

  activeTab: "CHART" | "MY_STOCK";
  setActiveTab: (v: "CHART" | "MY_STOCK") => void;

  animateMoney: boolean;
  showMoneyEffect: boolean;
  showSellEffect: boolean;

  showGuideModal: boolean;
  setShowGuideModal: (v: boolean) => void;

  checks: GuideChecks;
  toggleCheck: (key: keyof GuideChecks) => void;
  isAllChecked: boolean;

  money: number;
  hasBoughtToday: boolean;
  isHoldingStock: (id: number) => boolean;

  handleBuyClick: () => void;
  handleBuyConfirm: () => void;
  handleSellClick: () => void;
};

// ─────────────────────────────────────────
// 📌 훅
// ─────────────────────────────────────────
export const useStockDetail = (company: Company): UseStockDetailReturn => {
  // UI 상태
  const [period, setPeriod] = useState<"7d" | "30d">("7d");
  const [activeTab, setActiveTab] = useState<"CHART" | "MY_STOCK">("CHART");

  // 거래 이펙트 상태
  const [animateMoney, setAnimateMoney] = useState(false); // 돈 감소 애니메이션
  const [showMoneyEffect, setShowMoneyEffect] = useState(false); // 구매 시 -금액 표시
  const [showSellEffect, setShowSellEffect] = useState(false); // 판매 시 +금액 표시

  // 구매 가이드 모달
  const [showGuideModal, setShowGuideModal] = useState(false);

  // 첫 구매 여부 (가이드 팝업 노출 조건)
  const [hasCompletedFirstBuy, setHasCompletedFirstBuy] = useState(() =>
    getStorage("hasCompletedFirstBuy", false),
  );

  // 구매 전 체크리스트
  const [checks, setChecks] = useState<GuideChecks>({
    rule1: false,
    rule2: false,
    rule3: false,
    rule4: false,
  });

  const reasonRef = useRef("");

  const buyQuantityRef = useRef(1);

  const isAllChecked = Object.values(checks).every(Boolean);

  // Context
  const { buyStock, sellStock, hasBoughtToday, isHoldingStock } = useTrade();
  const { openModal, closeModal } = useModal();
  const { user, spendMoney, addMoney, spendDollars, addDollars } = useUser();
  const { giveReward } = useReward();
  const navigate = useNavigate();
  const { portfolio } = usePortfolio();

  //수량만큼 판매
  const sellQuantityRef = useRef(1);

  const isUS = company.country === "US";

  // 현재 종목 포트폴리오 정보 (평균 매수가, 보유 수량)
  const currentPortfolioItem = portfolio.find((p) => p.id === company.id);
  const holdingQuantity = currentPortfolioItem?.quantity ?? 0;
  const avgBuyPrice = currentPortfolioItem?.buyPrice ?? company.price;

  // 체크리스트 토글
  const toggleCheck = (key: keyof GuideChecks) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 돈 감소 감지 → 애니메이션
  const prevMoneyRef = useRef(user.money);
  useEffect(() => {
    if (user.money < prevMoneyRef.current) {
      setAnimateMoney(true);
      const timer = setTimeout(() => setAnimateMoney(false), 180);
      return () => clearTimeout(timer);
    }
    prevMoneyRef.current = user.money;
  }, [user.money]);

  // ─── 구매 로직 ────────────────────────────
  const handleBuyConfirm = () => {
    playMoneySound();

    const qty = buyQuantityRef.current;
    const totalPrice = company.price * qty;

    // ✅ 미국 주식이면 달러로, 한국 주식이면 원화로 차감
    if (isUS) {
      spendDollars(totalPrice); // 달러 차감
    } else {
      spendMoney(totalPrice); // 원화 차감
    }

    setShowMoneyEffect(true);
    setTimeout(() => setShowMoneyEffect(false), 500);

    // ✅ country 넘겨서 포트폴리오에서 구분 가능하게
    // 수량만큼 반복 구매
    buyStock({
      id: company.id,
      name: company.name,
      price: company.price,
      country: company.country,
      reason: reasonRef.current,
      quantity: qty,
    });

    setStorage("hasCompletedFirstBuy", true);
    setHasCompletedFirstBuy(true);

    // 첫 구매일 기록 (7일마다 가이드 재노출용)
    setStorage("lastGuideDate", new Date().toISOString());

    giveReward("BUY_STOCK");
  };

  const handleBuyClick = () => {
    // ✅ 미국 주식이면 달러 잔액 체크, 한국 주식이면 원화 잔액 체크
    if (isUS) {
      if ((user.dollars ?? 0) < company.price) {
        openModal({
          type: "INFO",
          title: "달러가 부족해요 🥲",
          customContent: (
            <ExchangeGuide>
              <ExchangeText>
                이 주식을 사려면 <br /> <strong>${company.price}</strong>가
                필요해요!
              </ExchangeText>
              <ExchangeText $sub>
                달러가 없으면 미국 주식을 살 수 없어요.
                <br /> 환전 상점에서 원화를 달러로 바꿔보세요! 💱
              </ExchangeText>
              <GoExchangeButton
                onClick={() => {
                  closeModal();
                  navigate("/exchange");
                }}
              >
                🏦 환전하러 가기
              </GoExchangeButton>
            </ExchangeGuide>
          ),
          confirmText: "알겠어요",
        });
        return;
      }
    } else {
      if (user.money < company.price) {
        openModal({
          type: "INFO",
          title: "돈이 부족해요 🥲",
          message: `이 주식을 사려면 ${company.price.toLocaleString()}원이 필요해요!`,
          confirmText: "알겠어요",
        });
        return;
      }
    }
    // 첫 구매면 가이드 먼저
    if (!hasCompletedFirstBuy) {
      setShowGuideModal(true);
      return;
    }
    // 7일마다 가이드 재노출
    if (shouldShowGuide()) {
      setShowGuideModal(true);
      return;
    }
    openModal({
      type: "CONFIRM",
      title: "구매할까요?",
      customContent: (
        <TradeSummary
          type="BUY"
          name={company.name}
          money={isUS ? (user.dollars ?? 0) : user.money}
          price={company.price}
          country={company.country}
          onReasonChange={(reason) => {
            reasonRef.current = reason;
          }}
          onQuantityChange={(qty) => {
            buyQuantityRef.current = qty;
          }}
        />
      ),
      confirmText: "구매",
      cancelText: "아니오",
      onConfirm: handleBuyConfirm,
    });
  };

  // ─── 판매 로직 ────────────────────────────
  const handleSellConfirm = () => {
    playMoneySound();
    const qty = sellQuantityRef.current;
    const totalPrice = company.price * qty;

    // ✅ 미국 주식 판매 → 달러로 받기 / 한국 주식 → 원화로 받기
    if (isUS) {
      addDollars(totalPrice);
    } else {
      addMoney(totalPrice);
    }

    setShowSellEffect(true);
    setTimeout(() => setShowSellEffect(false), 900);

    for (let i = 0; i < qty; i++) {
      sellStock({ ...company, country: company.country });
    }
    giveReward("SELL_STOCK");
  };

  const handleSellClick = () => {
    if (!isHoldingStock(company.id)) {
      openModal({
        type: "INFO",
        title: "판매할 주식이 없어요",
        message: "먼저 주식을 구매해야 판매할 수 있어요!",
        confirmText: "알겠어요",
      });
      return;
    }
    openModal({
      type: "CONFIRM",
      title: "판매할까요?",
      customContent: (
        <SellSummary
          name={company.name}
          price={company.price}
          buyPrice={avgBuyPrice}
          holdingQuantity={holdingQuantity}
          money={isUS ? (user.dollars ?? 0) : user.money}
          country={company.country}
          onQuantityChange={(qty) => {
            sellQuantityRef.current = qty;
          }}
        />
      ),
      confirmText: "판매",
      cancelText: "아니오",
      onConfirm: handleSellConfirm,
    });
  };

  // 가이드 재노출 판단 (7일마다)
  const shouldShowGuide = () => {
    const last = getStorage<string | null>("lastGuideDate", null);
    if (!last) return true;
    const diff =
      (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 7;
  };

  return {
    period,
    setPeriod,
    activeTab,
    setActiveTab,
    animateMoney,
    showMoneyEffect,
    showSellEffect,
    showGuideModal,
    setShowGuideModal,
    checks,
    toggleCheck,
    isAllChecked,
    money: user.money,
    hasBoughtToday,
    isHoldingStock,
    handleBuyClick,
    handleBuyConfirm,
    handleSellClick,
  };
};

const ExchangeGuide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 4px 0;
`;

const ExchangeText = styled.p<{ $sub?: boolean }>`
  margin: 0;
  font-size: ${({ $sub }) => ($sub ? "13px" : "15px")};
  font-weight: ${({ $sub }) => ($sub ? "400" : "600")};
  color: ${({ theme, $sub }) =>
    $sub ? theme.colors.textSecondary : theme.colors.text};
  text-align: center;
  line-height: 1.5;
`;

const GoExchangeButton = styled.button`
  margin-top: 4px;
  padding: 10px 20px; // width: 100% 제거 → 자연스러운 너비
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: transparent; // 파란 배경 제거
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background 0.15s ease;
  &:hover {
    background: ${({ theme }) => theme.colors.primary}10;
  }
  &:active {
    transform: scale(0.97);
  }
`;
