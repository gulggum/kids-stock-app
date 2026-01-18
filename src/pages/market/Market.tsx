import styled from "styled-components";
import StockCard from "../../components/stock/StockCard";
import { useNavigate } from "react-router";

// 실제 API 연결 전까지 사용
const mockStocks = [
  {
    id: 1,
    name: "삼성전자",
    character: "🤖",
    price: 72000,
    changeRate: 1.8,
  },
  {
    id: 2,
    name: "농심",
    character: "🍜",
    price: 410000,
    changeRate: -0.7,
  },
  {
    id: 3,
    name: "현대차",
    character: "🚗",
    price: 182000,
    changeRate: 0.4,
  },
];

const Market = () => {
  const navigate = useNavigate();
  const handleCardClick = (id: number) => {
    navigate(`/market/${id}`);
    console.log(id);
  };
  return (
    <Wrapper>
      {/* 📢 페이지 타이틀 */}
      <Title>주식 마켓</Title>

      {/* 🧩 주식 카드 리스트 */}
      {mockStocks.map((stock) => (
        <StockCard
          key={stock.id}
          name={stock.name}
          character={stock.character}
          price={stock.price}
          changeRate={stock.changeRate}
          onClick={() => handleCardClick(stock.id)}
        />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* 
  pc버전용..?
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px; */
`;

// 페이지 제목
const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 22px;
`;

export default Market;
