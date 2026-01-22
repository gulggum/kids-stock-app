// 캐릭터 페이지 -> 미니상점
// 상점 페이지 -> 전체목록 + 설명

import styled, { keyframes } from "styled-components";
import { useCoin } from "../context/CoinContext";
import { characterItems, type CharacterItem } from "../data/characterItems";
import { useToast } from "../context/ToastContext";
import { useItem } from "../context/ItemContext";
import { useState } from "react";
import { useCharacter } from "../context/CharacterContext";

const Shop = () => {
  const { coins } = useCoin();
  const { createToast } = useToast();
  const { buyItem, isOwned, equippedItems } = useItem();
  const { addExp } = useCharacter();
  const [sparkleItemId, setSparkleItemId] = useState<string | null>(null);
  const [confirmItem, setConfirmItem] = useState<CharacterItem | null>(null);

  const handleBuyItem = (itemId: string, price: number) => {
    const result = buyItem(itemId, price);
    if (result === "ALREADY_OWNED") {
      createToast("이미 가지고 있는 아이템이에요 😊");
    } else if (result === "NOT_ENOUGH_COIN") {
      createToast("코인이 부족해요 🥲");
    } else if (result === "SUCCESS") {
      createToast("아이템을 얻었어요! 🎉");
      addExp(10); //경험치 10 지급
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
                setConfirmItem(item);
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
      {confirmItem && (
        <ModalOverlay>
          <Modal>
            <ModalTitle>구매할까요?</ModalTitle>

            <ModalItem>
              {confirmItem.emoji} {confirmItem.name}
            </ModalItem>

            <ModalPrice>{confirmItem.price} 코인</ModalPrice>

            <ModalButtons>
              <CancelButton onClick={() => setConfirmItem(null)}>
                아니오
              </CancelButton>

              <ConfirmButton
                onClick={() => {
                  handleBuyItem(confirmItem.id, confirmItem.price);
                  setConfirmItem(null);
                }}
              >
                네!
              </ConfirmButton>
            </ModalButtons>
          </Modal>
        </ModalOverlay>
      )}
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
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const Modal = styled.div`
  width: 280px;
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  text-align: center;

  box-shadow: ${({ theme }) => theme.shadows.md};
`;
const ModalTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 12px;
`;
const ModalItem = styled.div`
  font-size: 20px;
  margin-bottom: 8px;
`;
const ModalPrice = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 16px;
`;
const ModalButtons = styled.div`
  display: flex;
  gap: 10px;
`;
const CancelButton = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  border: none;
  background: ${({ theme }) => theme.colors.border};
  font-weight: 700;
`;
const ConfirmButton = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
`;

export default Shop;
