// 관리자 메인 대시보드 — Supabase 실제 데이터 연결
import styled from "styled-components";
import {
  Newspaper,
  Users,
  TrendingUp,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { useAdminStats } from "../../hooks/Useadminstats";

const AdminDashboard = () => {
  const { stats, loading } = useAdminStats();

  const cards = [
    {
      icon: <MessageCircle size={20} />,
      label: "문의 요청",
      value: loading ? "..." : `${stats.totalInquiries}건`,
      color: "#FF8FA3",
      desc: "유저가 남긴 문의",
    },
    {
      icon: <Newspaper size={20} />,
      label: "오늘 뉴스",
      value: loading ? "..." : `${stats.todayNews}개`,
      color: "#2E8EDB",
      desc: "오늘 등록된 뉴스",
    },
    {
      icon: <Users size={20} />,
      label: "총 유저",
      value: loading ? "..." : `${stats.totalUsers}명`,
      color: "#9B59B6",
      desc: "가입한 전체 유저",
    },
    {
      icon: <TrendingUp size={20} />,
      label: "오늘 거래",
      value: loading ? "..." : `${stats.todayTrades}건`,
      color: "#6BCB3D",
      desc: "오늘 발생한 주식 거래",
    },
    {
      icon: <BookOpen size={20} />,
      label: "오늘 퀴즈",
      value: loading ? "..." : `${stats.todayQuizzes}회`,
      color: "#F39C12",
      desc: "오늘 퀴즈 푼 횟수",
    },
  ];

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
