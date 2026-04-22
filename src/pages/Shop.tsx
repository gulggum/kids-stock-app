// 캐릭터 페이지 -> 미니상점
// 상점 페이지 -> 전체목록 + 설명
import { useToast } from "../context/UIContext/ToastContext";
import { useSkinItem } from "../context/SkinItemContext";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useModal } from "../context/UIContext/ModalContext";
import { playCoinSound } from "../utils/sounds";
import { useReward } from "../context/RewardContext";
// 👉 새로 만든 카드 데이터
import { cardSkins, isNewItem, type CardSkin } from "../data/static/cardSkins";
import { MysteryBox } from "../components/shop/mysteryBox";
import { isCardUnlocked } from "../utils/getLevelTier";
import { useUser } from "../context/UserContext";
import { supabase } from "../utils/supabase";
import { ShopTabs, type TabType } from "../components/shop/shopTabs";
import { useHouse } from "../hooks/useHouse";
import { getHouseTier, HOUSES, type House } from "../data/static/house";
import { useNavigate } from "react-router";

const Shop = () => {
  // -----------------------------
  // 📌 전역 상태 가져오기
  // -----------------------------
  const { createToast } = useToast(); // 토스트 메시지
  const { buySkin, isOwned, selectedSkin } = useSkinItem(); // 스킨 관련
  const { isOwned: isHouseOwned, buyHouse } = useHouse();
  const { openModal } = useModal(); // 확인 모달
  const { giveReward } = useReward();
  const { user } = useUser();
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  // 날짜 다르면 0, 같으면 저장된 횟수
  const adCount = user.adDate === today ? (user.adCount ?? 0) : 0;

  // -----------------------------
  // 📌 UI 상태
  // -----------------------------
  const [activeTab, setActiveTab] = useState<TabType>("HOUSE");
  const [sparkleId, setSparkleId] = useState<string | null>(null); // 구매 애니메이션용
  const [profiles, setProfiles] = useState<{ selected_skin: string | null }[]>(
    [],
  );

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("selected_skin");

      if (error) {
        console.error("db에서 프로필 불러오기 실패", error);
        return;
      }
      setProfiles(data || []);
    };
    fetchProfiles();
  });

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
  // handleBuy 아래에 추가
  // -----------------------------
  // 🏠 집 구매 처리
  // -----------------------------
  const handleBuyHouse = async (house: House) => {
    const result = await buyHouse(house.id, house.price);

    if (result === "ALREADY_OWNED") {
      createToast("이미 보유한 집이에요 😊");
      return;
    }
    if (result === "NOT_ENOUGH_COIN") {
      createToast("코인이 부족해요 🥲");
      return;
    }
    if (result === "SUCCESS") {
      playCoinSound();
      createToast("새 집을 장만했어요! 🏠🎉");
      giveReward("ITEM_PURCHASE");
      setSparkleId(house.id);
      setTimeout(() => setSparkleId(null), 600);
    }
  };
  // -----------------------------
  // 📌 필터링된 카드 목록
  // -----------------------------
  //인기스킨 hot
  const skinUsageMap = profiles.reduce(
    (acc, user) => {
      if (!user.selected_skin) return acc;
      if (user.selected_skin === "basic") return acc;

      acc[user.selected_skin] = (acc[user.selected_skin] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const hotSkinIds = [...cardSkins]
    .sort((a, b) => (skinUsageMap[b.id] || 0) - (skinUsageMap[a.id] || 0))
    .slice(0, 3)
    .map((item) => item.id);
  const filteredSkins = cardSkins
    .filter((item) => {
      if (item.id === "basic") return false;

      if (activeTab === "ALL") return true;

      if (activeTab === "NEW") {
        return isNewItem(item.releasedAt);
      }

      return item.rarity === activeTab;
    })
    .sort((a, b) => {
      const aIsHot = hotSkinIds.includes(a.id);
      const bIsHot = hotSkinIds.includes(b.id);

      const aIsNew = isNewItem(a.releasedAt);
      const bIsNew = isNewItem(b.releasedAt);

      // 1순위: HOT
      if (aIsHot && !bIsHot) return -1;
      if (!aIsHot && bIsHot) return 1;

      // 2순위: NEW
      if (aIsNew && !bIsNew) return -1;
      if (!aIsNew && bIsNew) return 1;

      // 3순위: rarity
      const rarityOrder = {
        LEGEND: 3,
        SPECIAL: 2,
        COMMON: 1,
      };

      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    });

  return (
    <Wrapper>
      {/* ----------------------------- */}
      {/* 🛍 상점 타이틀 */}
      {/* ----------------------------- */}
      <Title>{activeTab === "HOUSE" ? "집 상점 🏠" : "카드스킨 상점 💳"}</Title>

      {/* ----------------------------- */}
      {/* 🪙 보유 코인 표시 */}
      {/* ----------------------------- */}
      <CoinBar>
        🪙 보유 코인 <strong>{user.coin}</strong>
      </CoinBar>
      {/* ----------------------------- */}
      {/* 광고 버튼 */}
      {/* ----------------------------- */}
      <AdBanner onClick={() => navigate("/shop/ad")}>
        <AdBannerLeft>
          <AdBannerTitle>📺 광고 보고 코인 받기</AdBannerTitle>
          <AdBannerDesc>하루 3번 · 1회당 30 🪙</AdBannerDesc>
        </AdBannerLeft>
        <AdBannerCount $done={adCount >= 3}>
          {adCount}/3 {adCount >= 3 ? "✅" : "→"}
        </AdBannerCount>
      </AdBanner>
      {/* ----------------------------- */}
      {/* 📌 탭 (필터 버튼) */}
      {/* ----------------------------- */}
      <ShopTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ----------------------------- */}
      {/* 🧩 카드 목록 */}
      {/* ----------------------------- */}
      <Grid>
        {/* 🎁 랜덤 박스 */}
        {activeTab === "ALL" && <MysteryBox />}
        {/* HOUSE 탬 렌더링 */}
        {activeTab === "HOUSE" &&
          HOUSES.map((house) => {
            const owned = isHouseOwned(house.id);
            const locked = user.level < house.requiredLevel;
            const tier = getHouseTier(house.requiredLevel);

            return (
              <Card
                key={house.id}
                $owned={owned}
                $rarity="COMMON"
                $sparkle={sparkleId === house.id}
                onClick={() => {
                  if (locked) {
                    createToast(`Lv.${house.requiredLevel} 이상 필요해요 🔒`);
                    return;
                  }
                  if (owned) {
                    createToast("이미 보유한 집이에요 😊");
                    return;
                  }
                  openModal({
                    type: "CONFIRM",
                    title: `${house.name} 구매`,
                    message: `${house.price} 코인으로 구매할까요?`,
                    confirmText: "구매",
                    cancelText: "취소",
                    customContent: (
                      <PreviewCard>
                        {/* 뱃지 미리보기 */}
                        <PreviewBadge>
                          <img src={house.badge} alt={house.name} />
                        </PreviewBadge>
                        <PreviewName>{house.name}</PreviewName>
                      </PreviewCard>
                    ),
                    onConfirm: () => handleBuyHouse(house),
                  });
                }}
              >
                {/* 집 뱃지 이미지 */}
                <HouseBadgePreview>
                  {" "}
                  <img src={house.badge} alt={house.name} />
                </HouseBadgePreview>

                {/* 레벨 배지 */}
                <HouseLevelBadge $color={tier.color}>
                  {tier.label}
                </HouseLevelBadge>

                <Name>
                  <NameText>{house.name}</NameText>
                  {locked && <LockText>🔒 Lv.{house.requiredLevel}</LockText>}
                </Name>

                {!owned && <Price>{house.price} 코인</Price>}

                <Status>
                  {locked && "🔒 잠김"}
                  {!locked && !owned && "🔒 구매하기"}
                  {owned && "🎒 보유중"}
                </Status>
              </Card>
            );
          })}

        {activeTab !== "HOUSE" &&
          filteredSkins.map((item) => {
            const owned = isOwned(item.id); // 보유 여부
            const selected = selectedSkin === item.id; // 현재 적용 여부
            //캐릭터레벨별 상점잠금
            const unlocked = isCardUnlocked(user.level, item.unlockLevel);
            const locked = !unlocked;
            const isNew = isNewItem(item.releasedAt);
            const isHot = hotSkinIds.includes(item.id);
            return (
              <Card
                key={item.id}
                $owned={owned}
                $rarity={item.rarity}
                $sparkle={sparkleId === item.id}
                onClick={() => {
                  if (locked) {
                    createToast(`Lv.${item.unlockLevel} 이상 필요해요 🔒`);
                    return;
                  }

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
                {/* New, Hot 카드 배지 */}
                {isHot && <HotBadge>HOT</HotBadge>}
                {isNew && <NewBadge>NEW</NewBadge>}
                {/* 카드 이름 */}
                <Name>
                  <NameText> {item.name} </NameText>

                  {locked && <LockText>🔒 Lv.{item.unlockLevel}</LockText>}
                </Name>

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
  padding: 16px 5px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100vh;
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

const CardImage = styled.div<{ $skin: any }>`
  width: 100%;
  height: 90px;
  object-fit: cover;
  border-radius: 10px;
  background: ${({ $skin }) =>
    $skin.gradient
      ? $skin.gradient
      : `url(${$skin.image}) center/cover no-repeat`};

  overflow: hidden;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  font-weight: 700;
  font-size: 14px;
`;

const NameText = styled.div``;
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
  top: 3px;
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
`;

const LockText = styled.div`
  margin-top: 4px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
`;

const NewBadge = styled.div`
  position: absolute;
  top: 5px;
  left: 8px;
  z-index: 2;

  padding: 4px 7px;
  border-radius: 999px;

  background: linear-gradient(135deg, #60a5fa, #38bdf8);
  color: white;
  font-size: 10px;
  font-weight: 800;

  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.35);
`;

const HotBadge = styled.div`
  position: absolute;
  top: 5px;
  left: 8px;
  z-index: 2;

  padding: 4px 7px;
  border-radius: 999px;

  background: linear-gradient(135deg, #fb7185, #f97316);
  color: white;
  font-size: 10px;
  font-weight: 800;

  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.35);
`;
const HouseBadgePreview = styled.div`
  width: 100px;
  margin: 0 auto;

  svg,
  img {
    width: 100%;
    height: 100%;
  }
`;

const PreviewBadge = styled.div`
  width: 90px;
  height: 90px;

  svg,
  img {
    width: 100%;
    height: 100%;
  }
`;

const COLOR_MAP: Record<string, string> = {
  purple: "#534AB7",
  orange: "#c8900a",
  green: "#3a8a4a",
  blue: "#378ADD",
  gray: "#888780",
};

const HouseLevelBadge = styled.div<{ $color: string }>`
  position: absolute;
  top: 5px;
  left: 8px;
  z-index: 2;
  padding: 4px 7px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  color: white;
  background: ${({ $color }) => COLOR_MAP[$color] ?? "#888780"};
`;
const AdBanner = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  transition: transform 0.15s ease;
  &:active {
    transform: scale(0.98);
  }
`;

const AdBannerLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AdBannerTitle = styled.div`
  font-size: 14px;
  font-weight: 800;
`;

const AdBannerDesc = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const AdBannerCount = styled.div<{ $done: boolean }>`
  font-size: 14px;
  font-weight: 800;
  color: ${({ $done, theme }) =>
    $done ? theme.colors.muted : theme.colors.primary};
`;
