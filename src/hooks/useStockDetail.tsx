import { useEffect, useRef, useState } from "react";
import { useTrade } from "../context/TradeContext";
import { useModal } from "../context/UIContext/ModalContext";
import { useReward } from "../context/RewardContext";
import { useUser } from "../context/UserContext";
import { getStorage, setStorage } from "../utils/storage";
import { playMoneySound } from "../utils/sounds";
import TradeSummary from "../components/stock/TradeSummary";

/**
 * 📌 useStockDetail
 *
 * 역할: StockDetail 페이지의 상태 + 비즈니스 로직 전담
 * - UI와 로직을 분리해서 페이지는 "보여주는 역할"만 하게 만들기 위함
 *
 * TODO: Supabase 연동 시
 * - hasCompletedFirstBuy → user 테이블 컬럼으로 이전
 * - lastGuideDate → user 테이블 컬럼으로 이전
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
};

type UseStockDetailReturn = {
  period: "7d" | "1y";
  setPeriod: (v: "7d" | "1y") => void;

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
  const [period, setPeriod] = useState<"7d" | "1y">("7d");
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
  const isAllChecked = Object.values(checks).every(Boolean);

  // Context
  const { buyStock, sellStock, hasBoughtToday, isHoldingStock } = useTrade();
  const { openModal } = useModal();
  const { user, spendMoney, addMoney } = useUser();
  const { giveReward } = useReward();

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
    spendMoney(company.price);

    setShowMoneyEffect(true);
    setTimeout(() => setShowMoneyEffect(false), 500);

    buyStock(company);

    setStorage("hasCompletedFirstBuy", true);
    setHasCompletedFirstBuy(true);

    // 첫 구매일 기록 (7일마다 가이드 재노출용)
    setStorage("lastGuideDate", new Date().toISOString());

    giveReward("BUY_STOCK");
  };

  const handleBuyClick = () => {
    // ✅ 잔액 체크 추가
    if (user.money < company.price) {
      openModal({
        type: "INFO",
        title: "돈이 부족해요 🥲",
        message: `이 주식을 사려면 ${company.price.toLocaleString()}원이 필요해요!`,
        confirmText: "알겠어요",
      });
      return;
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
          money={user.money}
          price={company.price}
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
    addMoney(company.price);

    setShowSellEffect(true);
    setTimeout(() => setShowSellEffect(false), 900);

    sellStock(company);
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
        <TradeSummary
          type="SELL"
          name={company.name}
          money={user.money}
          price={company.price}
          buyPrice={company.price}
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
