import styled from "styled-components";

const CharacterPage = () => {
  return (
    <Wrapper>
      {/* 👦 캐릭터 영역 */}
      <CharacterCard>
        <Avatar>🧒</Avatar>
        <Name>초보 투자자</Name>
        <Level>Lv. 1 🌱</Level>
      </CharacterCard>

      {/* 🪙 코인 상태 */}
      <StatusCard>
        <StatusRow>
          <span>🪙 보유 코인</span>
          <strong>3</strong>
        </StatusRow>
        <Badge>🎖️ 오늘의 한 번 완료</Badge>
      </StatusCard>

      {/* 🧢 꾸미기 아이템 */}
      <ItemSection>
        <SectionTitle>꾸미기 아이템</SectionTitle>

        <ItemGrid>
          <Item locked>
            <ItemEmoji>🧢</ItemEmoji>
            <ItemName>모자</ItemName>
            <ItemPrice>5코인</ItemPrice>
            <Lock>🔒</Lock>
          </Item>

          <Item>
            <ItemEmoji>👕</ItemEmoji>
            <ItemName>티셔츠</ItemName>
            <ItemPrice>3코인</ItemPrice>
            <Lock>🔓</Lock>
          </Item>

          <Item locked>
            <ItemEmoji>👟</ItemEmoji>
            <ItemName>운동화</ItemName>
            <ItemPrice>4코인</ItemPrice>
            <Lock>🔒</Lock>
          </Item>
        </ItemGrid>
      </ItemSection>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* 👦 캐릭터 카드 */
const CharacterCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const Avatar = styled.div`
  font-size: 64px;
`;

const Name = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const Level = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

/* 🪙 상태 카드 */
const StatusCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
`;

const Badge = styled.div`
  align-self: flex-start;
  background: ${({ theme }) => theme.colors.accentPurple};
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
`;

/* 🧢 아이템 */
const ItemSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const Item = styled.div<{ locked?: boolean }>`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  opacity: ${({ locked }) => (locked ? 0.6 : 1)};
`;

const ItemEmoji = styled.div`
  font-size: 28px;
`;

const ItemName = styled.div`
  font-size: 13px;
`;

const ItemPrice = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Lock = styled.div`
  font-size: 14px;
`;

export default CharacterPage;
