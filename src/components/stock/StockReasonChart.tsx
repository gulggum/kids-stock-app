// 주식 구매 이유 통계 컴포넌트
// - 해당 주식을 구매한 이유 분포를 막대 그래프로 표시
// - 직접 입력(커스텀)은 "기타"로 묶어서 표시
// - StockDetail 하단 섹션으로 삽입용

import styled from "styled-components";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { PRESET_REASONS } from "../stock/TradeSummary";

type ReasonStat = {
  reason: string;
  count: number;
};

type Props = {
  stockId: number;
};

const StockReasonChart = ({ stockId }: Props) => {
  const [stats, setStats] = useState<ReasonStat[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("trades")
        .select("reason")
        .eq("stock_id", stockId)
        .eq("type", "BUY")
        .not("reason", "is", null);

      if (!data || data.length === 0) {
        setStats([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      // 이유별 카운트 집계
      // PRESET에 없는 값은 "기타"로 분류
      const map: Record<string, number> = {};
      data.forEach((t) => {
        const reason = PRESET_REASONS.includes(t.reason) ? t.reason : "기타";
        map[reason] = (map[reason] ?? 0) + 1;
      });

      const result = Object.entries(map)
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count);

      setStats(result);
      setTotal(data.length);
      setLoading(false);
    };

    fetch();
  }, [stockId]);

  // 데이터 없거나 로딩 중이면 렌더 안 함
  if (loading || stats.length === 0) return null;

  const max = Math.max(...stats.map((s) => s.count), 1);

  return (
    <Wrapper>
      <Title>👀 친구들은 왜 이 주식을 샀을까 ?</Title>
      <SubTitle>총 {total}명이 구매했어요</SubTitle>

      <BarList>
        {stats.map((s) => (
          <BarRow key={s.reason}>
            <BarLabel>{s.reason}</BarLabel>
            <BarTrack>
              <BarFill $ratio={s.count / max} />
            </BarTrack>
            <BarRight>
              <BarCount>{s.count}명</BarCount>
              <BarPercent>{Math.round((s.count / total) * 100)}%</BarPercent>
            </BarRight>
          </BarRow>
        ))}
      </BarList>
    </Wrapper>
  );
};

export default StockReasonChart;

/* ================= 스타일 ================= */

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const SubTitle = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: -6px;
`;

const BarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  width: 110px;
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

const BarFill = styled.div<{ $ratio: number }>`
  height: 100%;
  width: ${({ $ratio }) => `${Math.round($ratio * 100)}%`};
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 999px;
  transition: width 0.5s ease;
`;

const BarRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 36px;
  flex-shrink: 0;
`;

const BarCount = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const BarPercent = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.muted};
`;
