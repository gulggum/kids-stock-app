import styled, { keyframes } from "styled-components";
import { useCoin } from "../context/CoinContext";
import { characterItems } from "../data/characterItems";
import { useToast } from "../context/ToastContext";
import { useItem, type EquipSlot } from "../context/ItemContext";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useCharacter } from "../context/CharacterContext";

const CharacterPage = () => {
  const { createToast } = useToast();
  const { coins } = useCoin(); //전역 코인 상태 연결
  const { isOwned, equippedItems, toggleEquip } = useItem();
  const { character, addExp } = useCharacter();
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false); //착장애니메이션
  const [activeSlot, setActiveSlot] = useState<EquipSlot>("hat"); // 현재 선택된 슬롯 상태
  const [levelUp, setLevelUp] = useState(false);

  const prevLevel = useRef(character.level); //이전 레벨 기억용(리렌더링 방지)

  useEffect(() => {
    // 장착 상태가 바뀔 때마다 애니메이션 ON
    setAnimate(true);

    // 0.4초 뒤 애니메이션 OFF
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [equippedItems]);

  useEffect(() => {
    if (character.level > prevLevel.current) {
      setLevelUp(true);
      prevLevel.current = character.level;

      //애니메이션 종료
      setTimeout(() => setLevelUp(false), 800);
    }
  }, [character.level]);

  // 선택된 슬롯에 해당하는 아이템만 보여줌
  const filteredItems = characterItems.filter(
    (item) => item.slot === activeSlot && isOwned(item.id),
  );

  // 현재 장착된 아이템들의 setId 모음
  const equippedSetIds = Object.values(equippedItems)
    .map((itemId) => characterItems.find((item) => item.id === itemId)?.setId)
    .filter(Boolean);

  // 같은 setId가 3개 이상이면 세트 완성
  const hasSchoolSet =
    equippedSetIds.filter((id) => id === "school").length >= 3;

  return (
    <Wrapper>
      {/* 👦 캐릭터 영역 */}
      <CharacterCard>
        {/* 기본 캐릭터 */}
        <CharacterArea>
          <Avatar $animate={animate} $levelUp={levelUp}>
            {" "}
            <BaseCharacter>🧒</BaseCharacter>
            {/* 장착된 아이템들 */}
            {equippedItems.hat && <Hat>🧢</Hat>}
            {equippedItems.top && <Top>👕</Top>}
            {equippedItems.shoes && <Shoes>👟</Shoes>}
          </Avatar>
        </CharacterArea>

        <Name>초보 투자자</Name>
        <Level>
          {" "}
          <LevelText>⭐ Lv.{character.level}</LevelText>
          <ExpBar>
            <ExpFill $value={character.exp} />
          </ExpBar>
          <ExpText>{character.exp} / 100 EXP</ExpText>
        </Level>
        {hasSchoolSet && <SetBonus>🎁 학교 세트 효과 발동!</SetBonus>}
      </CharacterCard>

      {/* 🪙 코인 상태 */}
      <StatusCard>
        <StatusRow>
          <span>🪙 보유 코인</span>
          <strong>{coins}</strong>
        </StatusRow>
        <Badge>🎖️ 오늘의 한 번 완료</Badge>
      </StatusCard>

      {/* 🧢 꾸미기 아이템 */}
      <ItemSection>
        <SectionTitle>꾸미기 아이템</SectionTitle>

        <ItemGrid>
          {filteredItems.length === 0 ? (
            <EmptyState>
              {/* 슬롯별 안내 문구 */}
              <Message>
                {activeSlot === "hat" && "🧢 아직 가진 모자가 없어요"}
                {activeSlot === "top" && "👕 아직 가진 옷이 없어요"}
                {activeSlot === "shoes" && "👟 아직 가진 신발이 없어요"}
              </Message>
              {/* 상점 바로가기 버튼 */}
              <GoShopButton onClick={() => navigate("/shop")}>
                🛍 아이템 보러가기
              </GoShopButton>
            </EmptyState>
          ) : (
            filteredItems.map((item) => {
              const owned = isOwned(item.id);
              const isEquipped = equippedItems[item.slot] === item.id;
              return (
                <Item
                  key={item.id}
                  $locked={!owned}
                  $equipped={isEquipped} //착장 상태 전달
                  onClick={() => {
                    if (!owned) {
                      createToast("먼저 아이템을 구매해주세요!");
                      return;
                    }
                    //이미 가지고 있으면 ->장착 /해제 토글
                    toggleEquip(item.slot, item.id);
                    addExp(3);
                  }}
                >
                  <ItemEmoji>{item.emoji}</ItemEmoji>
                  <ItemName>{item.name}</ItemName>
                  {!owned && <ItemPrice>{item.price}코인</ItemPrice>}
                  <Lock>
                    {" "}
                    {!owned && "🔒"}
                    {owned && !isEquipped && "🎒"} {/* 보유만 */}
                    {isEquipped && "⭐"} {/* 착용 중 */}
                  </Lock>
                  {/* 🏷 상태 텍스트 (아이 UX용) */}
                  <ItemStatus>
                    {!owned && "구매하기"}
                    {owned && !isEquipped && "착용하기"}
                    {isEquipped && "착용중"}
                  </ItemStatus>
                </Item>
              );
            })
          )}
        </ItemGrid>
      </ItemSection>
      {/* 슬롯 선택 버튼 */}
      <SlotTabs>
        <SlotButton
          $active={activeSlot === "hat"}
          onClick={() => setActiveSlot("hat")}
        >
          🧢 모자
        </SlotButton>

        <SlotButton
          $active={activeSlot === "top"}
          onClick={() => setActiveSlot("top")}
        >
          👕 옷
        </SlotButton>

        <SlotButton
          $active={activeSlot === "shoes"}
          onClick={() => setActiveSlot("shoes")}
        >
          👟 신발
        </SlotButton>
      </SlotTabs>
    </Wrapper>
  );
};
// 캐릭터가 통통 튀는 애니메이션
const pop = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
  100% {
    transform: scale(1);
  }
`;
//레벨업 애니메이션
const levelUpAnim = keyframes`
  0% { transform: scale(1); }
  40% { transform: scale(1.15); }
  100% { transform: scale(1); }
`;

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* 👦 캐릭터 카드 */
const CharacterCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const CharacterArea = styled.div`
  margin: 20px 0;
  padding: 24px 0;
  border-radius: ${({ theme }) => theme.radius.lg};

  /* 파스텔 배경 */
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.accentBlue},
    ${({ theme }) => theme.colors.background}
  );

  display: flex;
  justify-content: center;
`;

const Avatar = styled.div<{ $animate: boolean; $levelUp?: boolean }>`
  font-size: 64px;
  position: relative;
  font-size: 72px;
  transition: transform 0.2s;
  /* 장착 시에만 애니메이션 실행 */
  animation: ${({ $animate }) => ($animate ? pop : "none")} 0.4s ease;
  animation: ${({ $levelUp }) => ($levelUp ? levelUpAnim : "none")} 0.6s ease;
`;
const BaseCharacter = styled.div``;

const Level = styled.div`
  font-size: 13px;
  width: 100%;
  margin-bottom: 16px;
  padding: 14px;

  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.card};

  box-shadow: ${({ theme }) => theme.shadows.sm};
`;
const LevelText = styled.div`
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 8px;
`;
const ExpBar = styled.div`
  width: 100%;
  height: 10px;

  background: ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  overflow: hidden;
`;
const ExpFill = styled.div<{ $value: number }>`
  height: 100%;
  width: ${({ $value }) => `${$value}%`};

  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.accentBlue},
    ${({ theme }) => theme.colors.primary}
  );

  transition: width 0.3s ease; /* 경험치 오를 때 부드럽게 */
`;
const ExpText = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: right;
`;

/* 🪙 상태 카드 */
const StatusCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
`;

const Badge = styled.div`
  align-self: flex-start;
  background: ${({ theme }) => theme.colors.accentPurple};
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
`;

/* 🧢 아이템 카드*/
const ItemSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const Item = styled.div<{ $locked?: boolean; $equipped?: boolean }>`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  /* 장착 중인 아이템은 테두리 강조 */
  border: ${({ $equipped, theme }) =>
    $equipped ? `3px solid ${theme.colors.primary}` : "none"};

  opacity: ${({ $locked }) => ($locked ? 0.6 : 1)};
  cursor: ${({ $locked }) => ($locked ? "not-allowed" : "pointer")};
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    ${({ $locked }) =>
      !$locked &&
      `
      transform: translateY(-4px);
      box-shadow: 0 8px 18px rgba(0,0,0,0.12);
    `}
  }
`;

const ItemEmoji = styled.div`
  font-size: 28px;
`;

const ItemName = styled.div`
  font-size: 13px;
`;

const ItemPrice = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Lock = styled.div`
  font-size: 14px;
`;
const Hat = styled.div`
  position: absolute;
  top: -18px;
  left: 20px;
`;

const Top = styled.div`
  position: absolute;
  top: 40px;
  left: 20px;
`;

const Shoes = styled.div`
  position: absolute;
  top: 90px;
  left: 20px;
`;

const Name = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const ItemStatus = styled.div`
  margin-top: 6px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
//Slot탭
const SlotTabs = styled.div`
  display: flex;
  gap: 10px;
  margin: 12px 0 20px;
`;
const SlotButton = styled.button<{ $active: boolean }>`
  flex: 1; /* 버튼 너비 균등 */
  padding: 12px 0;
  border-radius: 999px; /* 알약 모양 */

  font-size: 14px;
  font-weight: 700;

  border: none;
  cursor: pointer;

  /* 기본 상태 */
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textSecondary};

  /* 선택된 슬롯 */
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ $active }) => ($active ? "#fff" : "inherit")};

  /* 살짝 떠있는 느낌 */
  box-shadow: ${({ $active }) =>
    $active ? "0 6px 0 rgba(0,0,0,0.15)" : "0 3px 0 rgba(0,0,0,0.08)"};

  /* 눌렀을 때 */
  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.12);
  }

  transition: all 0.15s ease;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  padding: 32px 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
`;
const Message = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};

  margin-bottom: 12px;
`;

const GoShopButton = styled.button`
  padding: 8px 14px;
  border-radius: 999px;
  border: none;

  font-size: 13px;
  font-weight: 700;

  background: ${({ theme }) => theme.colors.primary};
  color: #fff;

  cursor: pointer;

  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15);

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.15);
  }

  transition: all 0.15s ease;
`;
const SetBonus = styled.div`
  margin-top: 12px;
  padding: 10px 14px;

  border-radius: ${({ theme }) => theme.radius.md};

  /* 세트 보너스는 눈에 띄는 색 */
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.primary}
  );

  color: #fff;
  font-size: 13px;
  font-weight: 700;
  text-align: center;

  /* 살짝 뜨는 느낌 */
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.15);
`;

export default CharacterPage;
