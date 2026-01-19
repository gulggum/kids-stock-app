import styled from "styled-components";
import { usePortfolio } from "../../context/PortfolioContext";
import PortfolioSummaryCard from "../../components/portfolio/PortfolioSummaryCard";

const PortfolioPage = () => {
  const { items } = usePortfolio();
  console.log("😍", items);
  return (
    <Wrapper>
      {/*  상단 요약 카드 */}
      <TopSection>
        <PageTitle>내 포트폴리오 💼</PageTitle>
        <PortfolioSummaryCard />
      </TopSection>

      {/*  보유 주식 목록 */}
      <ListSection>
        {items.length === 0 ? (
          <Empty>
            아직 산 주식이 없어요 🥲
            <SmallHint>마켓에서 주식을 골라보세요!</SmallHint>
          </Empty>
        ) : (
          items.map((item) => (
            <ItemCard key={item.id}>
              <strong>{item.name}</strong>
              <span>{item.quantity}주 보유</span>
            </ItemCard>
          ))
        )}
      </ListSection>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TopSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PageTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 22px;
`;

const ListSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Empty = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
  text-align: center;
  font-size: 15px;
`;

const SmallHint = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const ItemCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 14px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`;

export default PortfolioPage;
