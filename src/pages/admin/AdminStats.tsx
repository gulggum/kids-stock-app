// 관리자 통계 페이지 — 투자 이유 분포(파이차트) + 인기 종목 TOP5
import styled from "styled-components";
import { useAdminStats } from "../../hooks/Useadminstats";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#2E8EDB", "#6BCB3D", "#F39C12", "#9B59B6", "#e53935"];

// 툴팁 커스텀 컴포넌트
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <TooltipBox>
      <TooltipLabel>{payload[0].name}</TooltipLabel>
      <TooltipValue>{payload[0].value}건</TooltipValue>
    </TooltipBox>
  );
};

const AdminStats = () => {
  const { stats, loading } = useAdminStats();
  const maxStock = Math.max(...stats.topStocks.map((s) => s.count), 1);

  return (
    <Container>
      <SectionTitle>📈 서비스 통계</SectionTitle>

      {loading ? (
        <LoadingText>불러오는 중...</LoadingText>
      ) : (
        <>
          {/* 투자 이유 분포 — 파이 차트 */}
          <SectionCard>
            <CardTitle>🤔 투자 이유 분포</CardTitle>
            {stats.reasonStats.length === 0 ? (
              <EmptyText>아직 데이터가 없어요</EmptyText>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={stats.reasonStats}
                    dataKey="count"
                    nameKey="reason"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {stats.reasonStats.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <LegendText>{value}</LegendText>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </SectionCard>
          {/* 투자 이유 분포 — 막대 그래프 */}
          <SectionCard>
            <CardTitle>🤔 투자 이유 분포 (상세)</CardTitle>
            {stats.reasonStats.length === 0 ? (
              <EmptyText>아직 데이터가 없어요</EmptyText>
            ) : (
              stats.reasonStats.map((r) => (
                <BarRow key={r.reason}>
                  <BarLabel>{r.reason}</BarLabel>
                  <BarTrack>
                    <BarFill
                      $ratio={
                        r.count /
                        Math.max(...stats.reasonStats.map((x) => x.count), 1)
                      }
                      $color="#2E8EDB"
                    />
                  </BarTrack>
                  <BarCount>{r.count}건</BarCount>
                </BarRow>
              ))
            )}
          </SectionCard>

          {/* 인기 종목 TOP5 — 막대 그래프 */}
          <SectionCard>
            <CardTitle>📊 인기 종목 TOP5</CardTitle>
            {stats.topStocks.length === 0 ? (
              <EmptyText>아직 데이터가 없어요</EmptyText>
            ) : (
              stats.topStocks.map((s, idx) => (
                <BarRow key={s.stock_name}>
                  <Rank $idx={idx}>{idx + 1}</Rank>
                  <BarLabel>{s.stock_name}</BarLabel>
                  <BarTrack>
                    <BarFill $ratio={s.count / maxStock} $color="#6BCB3D" />
                  </BarTrack>
                  <BarCount>{s.count}건</BarCount>
                </BarRow>
              ))
            )}
          </SectionCard>
        </>
      )}
    </Container>
  );
};

export default AdminStats;

/* ================= 스타일 ================= */

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
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardTitle = styled.p`
  font-size: 14px;
  font-weight: 800;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BarLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  width: 120px;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $ratio: number; $color: string }>`
  height: 100%;
  width: ${({ $ratio }) => `${Math.round($ratio * 100)}%`};
  background: ${({ $color }) => $color};
  border-radius: 999px;
  transition: width 0.5s ease;
`;

const BarCount = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  width: 32px;
  text-align: right;
  flex-shrink: 0;
`;

const Rank = styled.span<{ $idx: number }>`
  font-size: 13px;
  font-weight: 800;
  width: 20px;
  flex-shrink: 0;
  color: ${({ $idx }) =>
    $idx === 0
      ? "#F39C12"
      : $idx === 1
        ? "#9B59B6"
        : $idx === 2
          ? "#2E8EDB"
          : "#999"};
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`;

const EmptyText = styled.p`
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  padding: 8px 0;
`;

const LegendText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
`;

const TooltipBox = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 8px 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const TooltipLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 2px;
`;

const TooltipValue = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;
