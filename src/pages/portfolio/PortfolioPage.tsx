import styled from "styled-components";
import { usePortfolio } from "../../context/PortfolioContext";

const PortfolioPage = () => {
  const { items } = usePortfolio();
  console.log("😍", items);
  return (
    <Wrapper>
      <Title>내 포트폴리오 💼</Title>
      {items.length === 0 ? (
        <Empty>아직 구매한 주식이 없어요 🥲</Empty>
      ) : (
        items.map((item) => (
          <Card key={item.id}>
            <strong>{item.name}</strong>
            <div>수량: {item.quantity}주</div>
            <div>구매가: {item.buyPrice.toLocaleString()}원</div>
          </Card>
        ))
      )}
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
`;

const Empty = styled.div`
  padding: 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
export default PortfolioPage;
