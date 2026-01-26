import styled from "styled-components";
import { usePortfolio } from "../context/PortfolioContext";
import PortfolioSummaryCard from "../components/portfolio/PortfolioSummaryCard";
import { useNavigate } from "react-router";

const PortfolioPage = () => {
  const { portfolio } = usePortfolio();
  const navigate = useNavigate();

  return (
    <Wrapper>
      {/*  상단 요약 카드 */}
      <TopSection>
        <PageTitle>내 포트폴리오 💼</PageTitle>
        <PortfolioSummaryCard />
      </TopSection>

      {/*  보유 주식 목록 */}
      <ListSection>
        {portfolio.length === 0 ? (
          <Empty>
            아직 구매한 주식이 없어요 🥲
            <SmallHint>마켓에서 주식을 골라보세요!</SmallHint>
            <GoMarketButton onClick={() => navigate("/market")}>
              📈 마켓 바로가기
            </GoMarketButton>
          </Empty>
        ) : (
          portfolio.map((item) => (
            <ItemCard key={item.id}>
              <Title>{item.name}</Title>

              <Info>
                <Label>보유 수량</Label>
                <Value>{item.quantity}주</Value>
              </Info>

              <Info>
                <Label>평균 단가</Label>
                <Value>{item.buyPrice.toLocaleString()}원</Value>
              </Info>
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
const GoMarketButton = styled.button`
  margin-top: 6px;

  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;

  border-radius: ${({ theme }) => theme.radius.md};
  border: none;

  background: ${({ theme }) => theme.colors.primary};
  color: white;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

const ItemCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 16px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  font-size: 14px;
`;

// 회사명
const Title = styled.strong`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

// 한 줄 정보 묶음
const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// 왼쪽 라벨
const Label = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
`;

// 오른쪽 값 (숫자 강조)
const Value = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export default PortfolioPage;
