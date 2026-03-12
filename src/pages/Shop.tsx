// 캐릭터 페이지 -> 미니상점
// 상점 페이지 -> 전체목록 + 설명

import { useCoin } from "../context/WalletContext/CoinContext";
import {
  characterItems,
  type CharacterItem,
} from "../data/static/characterItems";
import { useToast } from "../context/UIContext/ToastContext";
import { useItem } from "../context/UserContext/ItemContext";
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useModal } from "../context/UIContext/ModalContext";
import { playCoinSound } from "../utils/sounds";
import { useReward } from "../context/RewardContext";
import { MysteryBox } from "../components/shop/mysteryBox";

const Shop = () => {
  const { coins } = useCoin();
  const { createToast } = useToast();
  const { buyItem, isOwned, equippedItems } = useItem();
  const { openModal } = useModal();
  const { giveReward } = useReward();
  const [sparkleItemId, setSparkleItemId] = useState<string | null>(null);

  const handleBuyConfirm = (item: CharacterItem) => {
    handleBuyItem(item.id, item.price);
  };
  const handleBuyItem = (itemId: string, price: number) => {
    const result = buyItem(itemId, price);
    if (result === "ALREADY_OWNED") {
      createToast("이미 가지고 있는 아이템이에요 😊");
    } else if (result === "NOT_ENOUGH_COIN") {
      createToast("코인이 부족해요 🥲");
    } else if (result === "SUCCESS") {
      playCoinSound();
      createToast("아이템을 얻었어요! 🎉");
      giveReward("ITEM_PURCHASE");
      setSparkleItemId(itemId); //반짝시작
      setTimeout(() => {
        setSparkleItemId(null);
      }, 600);
    }
  };

  return (
    <Wrapper>
      <Title>상점 🛍</Title>

      <CoinBar>
        🪙 보유 코인 <strong>{coins}</strong>
      </CoinBar>

      <Grid>
        {/* 🎁 랜덤 박스 */}
        <MysteryBox />

        {characterItems.map((item) => {
          const owned = isOwned(item.id);
          const isEquipped = equippedItems[item.slot] === item.id;
          return (
            <ItemCard
              key={item.id}
              $owned={owned}
              $sparkle={sparkleItemId === item.id}
              onClick={() => {
                if (owned) {
                  createToast("이미 가지고 있는 아이템이에요 😊");
                  return;
                }
                openModal({
                  type: "CONFIRM",
                  title: `${item.name}를 구매 할까요?`,
                  message: `${item.emoji} ${item.name} : \n ${item.price} 코인`,
                  confirmText: "네!",
                  cancelText: "아니오",
                  onConfirm: () => handleBuyConfirm(item),
                });
              }}
            >
              <Emoji>{item.emoji}</Emoji>
              <Name>{item.name}</Name>
              {!owned && <Price>{item.price} 코인</Price>}
              {/* 상태 아이콘 */}
              <StatusIcon>
                {!owned && "🔒"}
                {owned && !isEquipped && "🎒"}
                {isEquipped && "⭐"}
              </StatusIcon>

              {/* 상태 텍스트 */}
              <StatusText>
                {!owned && "구매하기"}
                {owned && !isEquipped && "보유중"}
                {isEquipped && "착용중"}
              </StatusText>
            </ItemCard>
          );
        })}
      </Grid>
      {/* 🔔 구매 확인 모달 */}
    </Wrapper>
  );
};

const sparkle = keyframes`
  0% {
    box-shadow: 0 0 0 rgba(255, 183, 3, 0);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 24px rgba(255, 183, 3, 0.8);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 rgba(255, 183, 3, 0);
    transform: scale(1);
  }
`;

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 22px;
`;

const CoinBar = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 12px;
  font-size: 14px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const ItemCard = styled.div<{ $owned?: boolean; $sparkle?: boolean }>`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  animation: ${({ $sparkle }) => ($sparkle ? sparkle : "none")} 0.6s ease;
  opacity: ${({ $owned }) => ($owned ? 0.6 : 1)};
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
  }
`;

const Emoji = styled.div`
  font-size: 32px;
`;

const Name = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

const Price = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const StatusIcon = styled.div`
  font-size: 18px;
  margin-top: 6px;
`;

const StatusText = styled.div`
  margin-top: 4px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

//구매확인창 모달

export default Shop;
