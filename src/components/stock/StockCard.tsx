import styled from "styled-components";

// 타입 정의 (주식 데이터 형태)
type StockCardProps = {
  name: string; // 회사 이름 (ex. 삼성전자)
  character: string; // 캐릭터 이모지 or 이미지
  price: number; // 현재 가격
  changeRate: number; // 변동률 (+면 상승, -면 하락)
  country: "KR" | "US";
  description: string; //아이기준 설명
  isFavorite?: boolean; //찜목록
  onToggleFavorite: () => void;
  onClick?: () => void; // 카드 클릭 시 동작 (상세 페이지 이동)
};

const StockCard = ({
  name,
  character,
  price,
  changeRate,
  description,
  isFavorite,
  onToggleFavorite,
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
        <Description>{description}</Description>
        <Price>{price.toLocaleString()}원</Price>
      </Info>
      <RightSide>
        <FavoriteButton
          onClick={(e) => {
            e.stopPropagation(); // 카드 클릭 방지
            onToggleFavorite?.();
          }}
        >
          {isFavorite ? "🌟" : "⭐"}
        </FavoriteButton>
        {/* 📈 / 📉 변동률 표시 */}
        <ChangeRate $positive={isPositive}>
          {isPositive ? "▲" : "▼"} {Math.abs(changeRate)}%
        </ChangeRate>
      </RightSide>
    </Card>
  );
};

// 카드 전체 래퍼
const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;

  box-shadow: ${({ theme }) => theme.shadows.sm};

  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

// 캐릭터 영역
const Character = styled.div`
  font-size: 28px;

  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;
  background: rgba(255, 255, 255, 0.4);
`;

// 회사 정보 영역
const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  min-width: 0;
`;

// 회사 이름
const Name = styled.div`
  font-family: ${({ theme }) => theme.fonts.title};
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;
const Description = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};

  /* 카드 UI 깨지지 않게 한 줄 제한 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  overflow: hidden;
`;

// 가격
const Price = styled.div`
  margin-top: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;

  height: 100%;
  gap: 6px;
`;
const FavoriteButton = styled.button`
  border: none;
  background: transparent;

  font-size: 22px;
  cursor: pointer;

  transition: transform 0.15s ease;

  &:active {
    transform: scale(1.2);
  }
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
