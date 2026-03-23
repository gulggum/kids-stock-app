// 캐릭터 페이지 -> 미니상점
// 상점 페이지 -> 전체목록 + 설명

import { useCoin } from "../context/WalletContext/CoinContext";
import { useToast } from "../context/UIContext/ToastContext";
import { useItem } from "../context/UserContext/ItemContext";
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useModal } from "../context/UIContext/ModalContext";
import { playCoinSound } from "../utils/sounds";
import { useReward } from "../context/RewardContext";
// 👉 새로 만든 카드 데이터
import { cardSkins, type CardSkin } from "../data/static/cardSkins";
import { MysteryBox } from "../components/shop/mysteryBox";

// -----------------------------
// 📌 탭 타입 (필터용)
// -----------------------------
type TabType = "ALL" | "HOT" | "COMMON" | "SPECIAL" | "LEGEND";

const Shop = () => {
  // -----------------------------
  // 📌 전역 상태 가져오기
  // -----------------------------
  const { coins } = useCoin(); // 보유 코인
  const { createToast } = useToast(); // 토스트 메시지
  const { buySkin, isOwned, selectedSkin } = useItem(); // 스킨 관련
  const { openModal } = useModal(); // 확인 모달
  const { giveReward } = useReward();

  // -----------------------------
  // 📌 UI 상태
  // -----------------------------
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [sparkleId, setSparkleId] = useState<string | null>(null); // 구매 애니메이션용

  // -----------------------------
  // 💰 구매 처리 함수
  // -----------------------------
  const handleBuy = (item: CardSkin) => {
    const result = buySkin(item.id, item.price);

    if (result === "ALREADY_OWNED") {
      createToast("이미 가지고 있는 카드예요 😊");
    }

    if (result === "NOT_ENOUGH_COIN") {
      createToast("코인이 부족해요 🥲");
    }

    if (result === "SUCCESS") {
      playCoinSound();
      createToast("카드를 획득했어요! 🎉");
      giveReward("ITEM_PURCHASE");

      // ✨ 반짝 효과
      setSparkleId(item.id);
      setTimeout(() => setSparkleId(null), 600);
    }
  };

  // -----------------------------
  // 📌 필터링된 카드 목록
  // -----------------------------
  const filteredSkins = cardSkins.filter((item) => {
    if (activeTab === "ALL") return true;

    if (activeTab === "HOT")
      return (
        item.rarity === "COMMON" ||
        item.rarity === "SPECIAL" ||
        item.rarity === "LEGEND"
      );
    return item.rarity === activeTab;
  });

  return (
    <Wrapper>
      {/* ----------------------------- */}
      {/* 🛍 상점 타이틀 */}
      {/* ----------------------------- */}
      <Title>카드 상점 💳</Title>

      {/* ----------------------------- */}
      {/* 🪙 보유 코인 표시 */}
      {/* ----------------------------- */}
      <CoinBar>
        🪙 보유 코인 <strong>{coins}</strong>
      </CoinBar>

      {/* ----------------------------- */}
      {/* 📌 탭 (필터 버튼) */}
      {/* ----------------------------- */}
      <TabRow>
        <TabButton
          $active={activeTab === "ALL"}
          onClick={() => setActiveTab("ALL")}
        >
          전체
        </TabButton>
        <TabButton
          $active={activeTab === "HOT"}
          onClick={() => setActiveTab("HOT")}
        >
          인기
        </TabButton>
        <TabButton
          $active={activeTab === "COMMON"}
          onClick={() => setActiveTab("COMMON")}
        >
          기본
        </TabButton>
        <TabButton
          $active={activeTab === "SPECIAL"}
          onClick={() => setActiveTab("SPECIAL")}
        >
          스페셜
        </TabButton>
        <TabButton
          $active={activeTab === "LEGEND"}
          onClick={() => setActiveTab("LEGEND")}
        >
          전설
        </TabButton>
      </TabRow>

      {/* ----------------------------- */}
      {/* 🧩 카드 목록 */}
      {/* ----------------------------- */}
      <Grid>
        {/* 🎁 랜덤 박스 */}
        {activeTab === "ALL" && <MysteryBox />}
        {filteredSkins.map((item) => {
          const owned = isOwned(item.id); // 보유 여부
          const selected = selectedSkin === item.id; // 현재 적용 여부

          return (
            <Card
              key={item.id}
              $owned={owned}
              $rarity={item.rarity}
              $sparkle={sparkleId === item.id}
              onClick={() => {
                // 👉 이미 가지고 있으면 안내
                if (owned) {
                  createToast("이미 보유한 카드예요 😊");
                  return;
                }

                // 👉 구매 확인 모달
                openModal({
                  type: "CONFIRM",

                  title: `${item.name} 구매`,

                  message: `${item.price} 코인으로 구매할까요?`,
                  confirmText: "구매",
                  cancelText: "취소",
                  customContent: (
                    <PreviewCard>
                      <PreviewImage $skin={item} />
                      <PreviewName>{item.name}</PreviewName>
                    </PreviewCard>
                  ),
                  onConfirm: () => handleBuy(item),
                });
              }}
            >
              {/* 카드 이미지 */}
              <CardImage $skin={item} />

              {/* 카드 이름 */}
              <Name>{item.name}</Name>

              {/* 가격 (미보유만 표시) */}
              {!owned && <Price>{item.price} 코인</Price>}

              {/* 상태 표시 */}
              <Status>
                {!owned && "🔒 구매하기"}
                {owned && !selected && "🎒 보유중"}
                {selected && "⭐ 사용중"}
              </Status>

              {/* 등급 뱃지 */}
              <Badge $rarity={item.rarity}>
                {item.rarity === "LEGEND"
                  ? "👑"
                  : item.rarity === "SPECIAL"
                    ? "⭐"
                    : ""}
              </Badge>
            </Card>
          );
        })}
      </Grid>
    </Wrapper>
  );
};

export default Shop;

/////////////////////////////////////////////////////////
// 🎨 스타일 영역
/////////////////////////////////////////////////////////

// ✨ 구매 시 반짝 애니메이션
const sparkle = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 rgba(255,215,0,0); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(255,215,0,0.8); }
  100% { transform: scale(1); box-shadow: 0 0 0 rgba(255,215,0,0); }
`;

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 800;
`;

const CoinBar = styled.div`
  padding: 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
`;

const TabRow = styled.div`
  display: flex;
  gap: 8px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 999px;
  border: none;
  font-weight: 700;
  cursor: pointer;

  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.surface};

  color: ${({ $active }) => ($active ? "#fff" : "inherit")};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const Card = styled.div<{
  $owned?: boolean;
  $rarity: string;
  $sparkle?: boolean;
}>`
  position: relative;
  padding: 12px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.card};
  cursor: pointer;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.08);

  opacity: ${({ $owned }) => ($owned ? 0.5 : 1)};
  /* -----------------------------
   🎒 보유중 표시 (opacity 대신)
  ----------------------------- */
  ${({ $owned }) =>
    $owned &&
    `
    &::after {
      content: "보유";
      position: absolute;
      top: 8px;
      left: 8px;

      font-size: 11px;
      font-weight: 700;
      color: white;

      padding: 4px 6px;
      border-radius: 999px;

      background: rgba(0,0,0,0.6);
    }
  `}

  animation: ${({ $sparkle }) => ($sparkle ? sparkle : "none")} 0.6s;

  transition: 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  /* ✨ 레전드 glow */
  ${({ $rarity }) =>
    $rarity === "LEGEND" &&
    `
      box-shadow:
        0 0 0 2px rgba(255,215,0,0.6),
        0 0 20px rgba(255,215,0,0.5),
        0 4px 12px rgba(0,0,0,0.1);
    `}
`;

const CardImage = styled.img<{ $skin: any }>`
  width: 100%;
  height: 90px;
  object-fit: cover;
  border-radius: 10px;
  background: ${({ $skin }) =>
    $skin.gradient
      ? $skin.gradient
      : `url(${$skin.image}) center/cover no-repeat`};

  /* 가독성용 오버레이 */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;

    background: rgba(0, 0, 0, 0.15);
  }
`;

const Name = styled.div`
  margin-top: 6px;
  font-weight: 700;
  font-size: 14px;
`;

const Price = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Status = styled.div`
  margin-top: 6px;
  font-size: 12px;
  font-weight: 700;
`;

const Badge = styled.div<{ $rarity: string }>`
  position: absolute;
  top: 6px;
  right: 6px;

  font-size: 14px;
`;

const PreviewCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  margin-bottom: 8px;
`;

const PreviewName = styled.div`
  font-size: 13px;
  font-weight: 700;
`;

const PreviewImage = styled.div<{ $skin: any }>`
  width: 120px;
  height: 80px;
  border-radius: 12px;

  background: ${({ $skin }) =>
    $skin.gradient
      ? $skin.gradient
      : `url(${$skin.image}) center/cover no-repeat`};

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  position: relative;
  overflow: hidden;

  /* ✨ 살짝 어둡게 (텍스트 대비용) */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.1);
  }
`;
