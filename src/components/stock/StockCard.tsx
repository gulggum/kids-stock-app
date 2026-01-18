import styled from "styled-components";

// 타입 정의 (주식 데이터 형태)
type StockCardProps = {
  name: string; // 회사 이름 (ex. 삼성전자)
  character: string; // 캐릭터 이모지 or 이미지
  price: number; // 현재 가격
  changeRate: number; // 변동률 (+면 상승, -면 하락)
  onClick?: () => void; // 카드 클릭 시 동작 (상세 페이지 이동)
};

const StockCard = ({
  name,
  character,
  price,
  changeRate,
  onClick,
}: StockCardProps) => {
  const isPositive = changeRate >= 0;

  return (
    <Card onClick={onClick}>
      {/* 🧸 회사 캐릭터 */}
      <Character>{character}</Character>

      {/* 🏢 회사 정보 */}
      <Info>
        <Name>{name}</Name>
        <Price>{price.toLocaleString()}원</Price>
      </Info>

      {/* 📈 / 📉 변동률 표시 */}
      <ChangeRate $positive={isPositive}>
        {isPositive ? "▲" : "▼"} {Math.abs(changeRate)}%
      </ChangeRate>
    </Card>
  );
};

// 카드 전체 래퍼
const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  display: flex;
  align-items: center;
  gap: 12px;

  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:active {
    transform: scale(0.97);
  }
`;

// 캐릭터 영역
const Character = styled.div`
  font-size: 36px;
`;

// 회사 정보 영역
const Info = styled.div`
  flex: 1;
`;

// 회사 이름
const Name = styled.div`
  font-family: ${({ theme }) => theme.fonts.title};
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

// 가격
const Price = styled.div`
  margin-top: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// 변동률 (색상은 상승/하락에 따라 변경)
const ChangeRate = styled.div<{ $positive: boolean }>`
  //$=> 스타일 계산전용 props
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, $positive }) =>
    $positive ? theme.colors.up : theme.colors.down};
`;

export default StockCard;
