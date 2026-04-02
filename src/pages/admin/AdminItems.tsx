import styled from "styled-components";
import { ChevronRight, Plus } from "lucide-react";

/**
 * 아이템 관리 페이지
 */

const mockItems = [
  { emoji: "🎩", name: "모자", price: "500 포인트", color: "#9B59B6" },
  { emoji: "👓", name: "안경", price: "300 포인트", color: "#2E8EDB" },
  { emoji: "🎒", name: "가방", price: "700 포인트", color: "#F39C12" },
  { emoji: "👟", name: "신발", price: "400 포인트", color: "#6BCB3D" },
];

const AdminItems = () => {
  return (
    <Container>
      <HeaderRow>
        <SectionTitle>🛍️ 아이템 관리</SectionTitle>
        <AddButton>
          <Plus size={14} />
          추가
        </AddButton>
      </HeaderRow>

      <SectionCard>
        {mockItems.map((item, idx) => (
          <ItemRow key={item.name} $last={idx === mockItems.length - 1}>
            <IconWrapper style={{ background: `${item.color}18` }}>
              <span style={{ fontSize: 18 }}>{item.emoji}</span>
            </IconWrapper>

            <ItemText>
              <ItemLabel>{item.name}</ItemLabel>
              <ItemDesc>{item.price}</ItemDesc>
            </ItemText>

            <ChevronRight size={16} color="#ccc" />
          </ItemRow>
        ))}
      </SectionCard>
    </Container>
  );
};

export default AdminItems;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 4px;
`;

const SectionTitle = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const ItemRow = styled.button<{ $last: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: ${({ $last, theme }) =>
    $last ? "none" : `1px solid ${theme.colors.background}`};
  text-align: left;
  transition: 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const IconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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
