import styled from "styled-components";
import { Newspaper, Users, TrendingUp, ChevronRight } from "lucide-react";

/**
 * 관리자 메인 대시보드
 */

const cards = [
  {
    icon: <Newspaper size={20} />,
    label: "오늘 뉴스",
    value: "6개",
    color: "#2E8EDB",
    desc: "오늘 등록된 뉴스",
  },
  {
    icon: <Users size={20} />,
    label: "총 유저",
    value: "124명",
    color: "#9B59B6",
    desc: "가입한 전체 유저",
  },
  {
    icon: <TrendingUp size={20} />,
    label: "오늘 거래",
    value: "89건",
    color: "#6BCB3D",
    desc: "오늘 발생한 거래",
  },
];

const AdminDashboard = () => {
  return (
    <Container>
      <SectionTitle>📊 대시보드</SectionTitle>

      <SectionCard>
        {cards.map((card, idx) => (
          <StatItem key={card.label} $last={idx === cards.length - 1}>
            <IconWrapper style={{ background: `${card.color}18` }}>
              <span style={{ color: card.color }}>{card.icon}</span>
            </IconWrapper>

            <ItemText>
              <ItemLabel>{card.label}</ItemLabel>
              <ItemDesc>{card.desc}</ItemDesc>
            </ItemText>

            <ValueBadge style={{ color: card.color }}>{card.value}</ValueBadge>

            <ChevronRight size={16} color="#ccc" />
          </StatItem>
        ))}
      </SectionCard>
    </Container>
  );
};

export default AdminDashboard;

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

const StatItem = styled.div<{ $last: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-bottom: ${({ $last, theme }) =>
    $last ? "none" : `1px solid ${theme.colors.background}`};
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

const ValueBadge = styled.span`
  font-size: 15px;
  font-weight: 800;
`;
