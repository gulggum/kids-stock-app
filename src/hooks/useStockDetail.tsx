import { useEffect, useRef, useState } from "react";
import { useTrade } from "../context/TradeContext";
import { useModal } from "../context/UIContext/ModalContext";
import { useReward } from "../context/RewardContext";
import { playMoneySound } from "../utils/sounds";
import TradeSummary from "../components/stock/TradeSummary";
import { useUser } from "../context/UserContext/UserContext";

/**
 * 📌 useStockDetail
 * StockDetail 페이지의 상태 + 비즈니스 로직을 담당하는 커스텀 훅
 *
 * 👉 UI와 로직을 분리해서
 * 페이지는 "보여주는 역할"만 하게 만들기 위함
 */

/**
 * 📌 체크 상태 타입
 */
type GuideChecks = {
  rule1: boolean;
  rule2: boolean;
  rule3: boolean;
  rule4: boolean;
};

/**
 * 📌 회사 타입 (최소한만)
 * 👉 marketMockData 구조 기반
 */
export type Company = {
  id: number;
  name: string;
  price: number;
};

/**
 * 📌 useStockDetail 반환 타입
 * 👉 페이지에서 사용하는 값들 정의
 */
type UseStockDetailReturn = {
  /** 차트 기간 */
  period: "7d" | "1y";
  setPeriod: (v: "7d" | "1y") => void;

  /** 탭 상태 */
  activeTab: "CHART" | "MY_STOCK";
  setActiveTab: (v: "CHART" | "MY_STOCK") => void;

  /** 애니메이션 */
  animateMoney: boolean;
  showMoneyEffect: boolean;
  showSellEffect: boolean;

  /** 가이드 모달 */
  showGuideModal: boolean;
  setShowGuideModal: (v: boolean) => void;

  /** 체크 */
  checks: GuideChecks;
  toggleCheck: (key: keyof GuideChecks) => void;
  isAllChecked: boolean;

  /** 상태 */
  money: number;
  hasBoughtToday: boolean;
  isHoldingStock: (id: number) => boolean;

  /** 액션 */
  handleBuyClick: () => void;
  handleBuyConfirm: () => void;
  handleSellClick: () => void;
};

/**
 * 📌 useStockDetail
 * 👉 StockDetail의 "로직 전담"
 */
export const useStockDetail = (company: Company): UseStockDetailReturn => {
  /** =========================
   * 📊 UI 상태 관리
   * ========================= */

  // 차트 기간 (7일 / 1년)
  const [period, setPeriod] = useState<"7d" | "1y">("7d");

  // 탭 상태 (차트 / 내 주식)
  const [activeTab, setActiveTab] = useState<"CHART" | "MY_STOCK">("CHART");

  /** =========================
   * 💰 이펙트 상태
   * ========================= */

  const [animateMoney, setAnimateMoney] = useState(false); // 돈 감소 애니메이션
  const [showMoneyEffect, setShowMoneyEffect] = useState(false); // 구매 -금액 표시
  const [showSellEffect, setShowSellEffect] = useState(false); // 판매 +금액 표시

  /** =========================
   * 📌 가이드 모달 상태
   * ========================= */

  const [showGuideModal, setShowGuideModal] = useState(false);

  // 첫 구매 여부 (로컬스토리지)
  const [hasCompletedFirstBuy, setHasCompletedFirstBuy] = useState(() => {
    return localStorage.getItem("hasCompletedFirstBuy") === "true";
  });

  // 체크박스 상태
  const [checks, setChecks] = useState({
    rule1: false,
    rule2: false,
    rule3: false,
    rule4: false,
  });

  // 모든 체크 완료 여부
  const isAllChecked = Object.values(checks).every(Boolean);

  /** =========================
   * 🧠 Context 연결
   * ========================= */

  const { buyStock, sellStock, hasBoughtToday, isHoldingStock } = useTrade();
  const { openModal } = useModal();
  const { user, spendMoney, addMoney } = useUser();
  const { giveReward } = useReward();

  /** =========================
   * 💡 체크 토글 함수
   * ========================= */
  const toggleCheck = (key: keyof typeof checks) => {
    setChecks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /** =========================
   * 💰 돈 변화 감지 (애니메이션)
   * ========================= */
  const prevMoneyRef = useRef(user.money);

  useEffect(() => {
    if (user.money < prevMoneyRef.current) {
      setAnimateMoney(true);

      const timer = setTimeout(() => {
        setAnimateMoney(false);
      }, 180);

      return () => clearTimeout(timer);
    }

    prevMoneyRef.current = user.money;
  }, [user.money]);

  /** =========================
   * 🛒 구매 로직
   * ========================= */

  // 실제 구매 처리
  const handleBuyConfirm = () => {
    playMoneySound();

    // 돈 차감
    spendMoney(company.price);

    // 💰 이펙트
    setShowMoneyEffect(true);
    setTimeout(() => setShowMoneyEffect(false), 500);

    // 주식 구매
    buyStock(company);

    // 첫 구매 기록
    localStorage.setItem("hasCompletedFirstBuy", "true");
    setHasCompletedFirstBuy(true);
    //첫구매날부터 카운트계산 shouldShowGuide로직 (첫구매시만 가이드팝업 => 7일후 다시 가이드팝업 보여주기)
    localStorage.setItem("lastGuideDate", new Date().toISOString());

    // 보상 지급
    giveReward("BUY_STOCK");
  };

  // 구매 버튼 클릭
  const handleBuyClick = () => {
    // 👉 첫 구매면 가이드 먼저
    if (!hasCompletedFirstBuy) {
      setShowGuideModal(true);
      return;
    }
    //👉 7일마다 가이드 다시 보여주기
    if (shouldShowGuide()) {
      setShowGuideModal(true);
      return;
    }
    // 👉 일반 구매 확인 모달
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

  /** =========================
   * 💸 판매 로직
   * ========================= */

  const handleSellConfirm = () => {
    playMoneySound();

    // 돈 증가
    addMoney(company.price);

    // 💰 이펙트
    setShowSellEffect(true);
    setTimeout(() => setShowSellEffect(false), 900);

    // 주식 판매
    sellStock(company);

    giveReward("SELL_STOCK");
  };

  const handleSellClick = () => {
    // 👉 보유 없으면 막기
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
          price={company.price} //현재가격
          buyPrice={company.price} //구매가격
        />
      ),

      confirmText: "판매",
      cancelText: "아니오",
      onConfirm: handleSellConfirm,
    });
  };

  // 📌 가이드 노출 판단 (7일마다 노출)
  const shouldShowGuide = () => {
    const last = localStorage.getItem("lastGuideDate");
    if (!last) return true;

    const diff =
      (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24);

    return diff >= 7;
  };

  /** =========================
   * 📦 외부로 반환
   * ========================= */

  return {
    // 상태
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

    // context 값
    money: user.money,
    hasBoughtToday,
    isHoldingStock,

    // 액션
    handleBuyClick,
    handleBuyConfirm,
    handleSellClick,
  };
};
