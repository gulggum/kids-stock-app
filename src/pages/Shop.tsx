// 캐릭터 페이지 -> 미니상점
// 상점 페이지 -> 전체목록 + 설명

import styled from "styled-components";
import { useCoin } from "../context/CoinContext";
import { characterItems } from "../data/characterItems";
import { useState } from "react";
import { useToast } from "../context/ToastContext";

const Shop = () => {
  const { coins, spendCoin } = useCoin();
  const { createToast } = useToast();

  // 임시: 구매한 아이템 상태 (나중에 Context로 이동 가능)
  const [ownedItems, setOwnedItems] = useState<string[]>([]);

  const handleBuyItem = (id: number, price: number) => {
    if (ownedItems.includes(id)) {
      createToast("이미 가지고 있는 아이템이에요 😊");
      return;
    }
    const success = spendCoin(price);
    if (!success) {
      createToast("코인이 부족해요 🥲");
      return;
    }
    setOwnedItems((prev) => [...prev, id]);
    createToast("아이템을 구매했어요! 🎉");
  };

  return (
    <Wrapper>
      <Title>상점 🛍</Title>

      <CoinBar>
        🪙 보유 코인 <strong>{coins}</strong>
      </CoinBar>

      <Grid>
        {characterItems.map((item) => {
          const owned = ownedItems.includes(item.id);

          return (
            <ItemCard
              key={item.id}
              $owned={owned}
              onClick={() => handleBuyItem(item.id, item.price)}
            >
              <Emoji>{item.emoji}</Emoji>
              <Name>{item.name}</Name>
              <Price>{item.price} 코인</Price>
              <Status>{owned ? "보유중" : "구매하기"}</Status>
            </ItemCard>
          );
        })}
      </Grid>
    </Wrapper>
  );
};
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

const ItemCard = styled.div<{ $owned?: boolean }>`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
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

const Status = styled.div`
  font-size: 12px;
  font-weight: 700;
`;

export default Shop;
