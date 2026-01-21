import styled, { keyframes } from "styled-components";
import { useCoin } from "../context/CoinContext";
import { characterItems } from "../data/characterItems";
import { useToast } from "../context/ToastContext";
import { useItem } from "../context/ItemContext";
import { useEffect, useState } from "react";

const CharacterPage = () => {
  const { createToast } = useToast();
  const { coins } = useCoin(); //전역 코인 상태 연결
  const { isOwned, equippedItems, toggleEquip } = useItem();
  const [animate, setAnimate] = useState(false); //착장애니메이션

  useEffect(() => {
    // 장착 상태가 바뀔 때마다 애니메이션 ON
    setAnimate(true);

    // 0.4초 뒤 애니메이션 OFF
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [equippedItems]);

  return (
    <Wrapper>
      {/* 👦 캐릭터 영역 */}
      <CharacterCard>
        {/* 기본 캐릭터 */}
        <Avatar $animate={animate}>
          {" "}
          <BaseCharacter>🧒</BaseCharacter>
          {/* 장착된 아이템들 */}
          {equippedItems.hat && <Hat>🧢</Hat>}
          {equippedItems.top && <Top>👕</Top>}
          {equippedItems.shoes && <Shoes>👟</Shoes>}
        </Avatar>
        <Name>초보 투자자</Name>
        <Level>Lv. 1 🌱</Level>
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
          {characterItems.map((item) => {
            const owned = isOwned(item.id);
            const isEquipped = equippedItems[item.slot] === item.id;
            return (
              <Item
                key={item.id}
                $locked={!owned}
                onClick={() => {
                  if (!owned) {
                    createToast("먼저 아이템을 구매해주세요!");
                    return;
                  }
                  //이미 가지고 있으면 ->장착 /해제 토글
                  toggleEquip(item.slot, item.id);
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
          })}
        </ItemGrid>
      </ItemSection>
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

const Avatar = styled.div<{ $animate: boolean }>`
  font-size: 64px;
  position: relative;
  font-size: 72px;

  /* 장착 시에만 애니메이션 실행 */
  animation: ${({ $animate }) => ($animate ? pop : "none")} 0.4s ease;
`;
const BaseCharacter = styled.div``;

const Level = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
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

const Item = styled.div<{ $locked?: boolean }>`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
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

export default CharacterPage;
