import { useEffect, useRef, useState } from "react";
import { useTrade } from "../context/TradeContext";
import { useModal } from "../context/UIContext/ModalContext";
import { useMoney } from "../context/WalletContext/MoneyContext";
import { useReward } from "../context/RewardContext";
import { playMoneySound } from "../utils/sounds";

/**
 * 📌 useStockDetail
 * StockDetail 페이지의 상태 + 비즈니스 로직을 담당하는 커스텀 훅
 *
 * 👉 UI와 로직을 분리해서
 * 페이지는 "보여주는 역할"만 하게 만들기 위함
 */
export const useStockDetail = (company: any) => {
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
  const { money, spendMoney, addMoney } = useMoney();
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
  const prevMoneyRef = useRef(money);

  useEffect(() => {
    if (money < prevMoneyRef.current) {
      setAnimateMoney(true);

      const timer = setTimeout(() => {
        setAnimateMoney(false);
      }, 180);

      return () => clearTimeout(timer);
    }

    prevMoneyRef.current = money;
  }, [money]);

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
    // 👉 일반 구매 확인 모달
    openModal({
      type: "CONFIRM",
      title: "구매할까요?",
      message: `${company.name}\n${company.price}원`,
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
      message: `${company.name}\n${company.price}원`,
      confirmText: "판매",
      cancelText: "아니오",
      onConfirm: handleSellConfirm,
    });
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

    hasCompletedFirstBuy,

    // context 값
    money,
    hasBoughtToday,
    isHoldingStock,

    // 액션
    handleBuyClick,
    handleBuyConfirm,
    handleSellClick,
  };
};
