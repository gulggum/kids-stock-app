import styled from "styled-components";

/**
 * 투자 랭킹 페이지
 */

const mockRanking = [
  { rank: 1, nickname: "투자왕", asset: "1,200,000원", emoji: "🥇" },
  { rank: 2, nickname: "주식천재", asset: "980,000원", emoji: "🥈" },
  { rank: 3, nickname: "경제박사", asset: "870,000원", emoji: "🥉" },
  { rank: 4, nickname: "머니머니", asset: "750,000원", emoji: "4" },
  { rank: 5, nickname: "부자꿈나무", asset: "620,000원", emoji: "5" },
];

const AdminRanking = () => {
  return (
    <Container>
      <SectionTitle>🏆 투자 랭킹</SectionTitle>

      <SectionCard>
        {mockRanking.map((item, idx) => (
          <RankItem key={item.rank} $last={idx === mockRanking.length - 1}>
            <RankBadge $rank={item.rank}>
              {item.rank <= 3 ? item.emoji : item.rank}
            </RankBadge>

            <ItemText>
              <ItemLabel>{item.nickname}</ItemLabel>
              <ItemDesc>총 자산</ItemDesc>
            </ItemText>

            <AssetValue>{item.asset}</AssetValue>
          </RankItem>
        ))}
      </SectionCard>
    </Container>
  );
};

export default AdminRanking;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 4px;
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const RankItem = styled.div<{ $last: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-bottom: ${({ $last, theme }) =>
    $last ? "none" : `1px solid ${theme.colors.background}`};
`;

const RankBadge = styled.div<{ $rank: number }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: ${({ $rank }) => ($rank <= 3 ? "20px" : "14px")};
  font-weight: 800;
  background: ${({ $rank, theme }) =>
    $rank === 1
      ? "#FFF8DC"
      : $rank === 2
        ? "#F5F5F5"
        : $rank === 3
          ? "#FFF0E6"
          : theme.colors.surface};
  color: ${({ $rank, theme }) => ($rank <= 3 ? "inherit" : theme.colors.muted)};
`;

const ItemText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ItemLabel = styled.p`
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const ItemDesc = styled.p`
  font-size: 12px;
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const AssetValue = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;
