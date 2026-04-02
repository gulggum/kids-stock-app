import styled from "styled-components";
import { Users, BarChart2, BookOpen } from "lucide-react";

/**
 * 서비스 통계 페이지
 */

const stats = [
  {
    icon: <Users size={20} />,
    label: "총 유저",
    value: "128명",
    color: "#2E8EDB",
    desc: "전체 가입 유저 수",
  },
  {
    icon: <BarChart2 size={20} />,
    label: "오늘 거래",
    value: "54건",
    color: "#6BCB3D",
    desc: "오늘 발생한 주식 거래",
  },
  {
    icon: <BookOpen size={20} />,
    label: "뉴스 조회",
    value: "342회",
    color: "#F39C12",
    desc: "오늘 뉴스 읽은 횟수",
  },
];

const AdminStats = () => {
  return (
    <Container>
      <SectionTitle>📈 서비스 통계</SectionTitle>

      <SectionCard>
        {stats.map((stat, idx) => (
          <StatItem key={stat.label} $last={idx === stats.length - 1}>
            <IconWrapper style={{ background: `${stat.color}18` }}>
              <span style={{ color: stat.color }}>{stat.icon}</span>
            </IconWrapper>

            <ItemText>
              <ItemLabel>{stat.label}</ItemLabel>
              <ItemDesc>{stat.desc}</ItemDesc>
            </ItemText>

            <ValueBadge style={{ color: stat.color }}>{stat.value}</ValueBadge>
          </StatItem>
        ))}
      </SectionCard>
    </Container>
  );
};

export default AdminStats;

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
