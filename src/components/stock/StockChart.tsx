import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styled from "styled-components";
import CustomTooltip from "./CustomTooltip";

export type ChartPoint = {
  date: string; // x축 (날짜 or 인덱스)
  price: number; // y축 (가격)
};

type StockChartProps = {
  data: ChartPoint[]; // 차트에 그릴 데이터
  strokeColor: string; // 선 색 (상승/하락에 따라 부모에서 결정)
};

const StockChart = ({ data, strokeColor }: StockChartProps) => {
  return (
    <ChartWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          {/* 📅 X축: 날짜 (간단히 표시) */}
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />

          {/* 📐 Y축: 숫자 숨김 (아이용 UX) */}
          <YAxis hide />

          {/* 💬 툴팁: 눌렀을 때 가격만 보여줌 */}
          <Tooltip
            content={<CustomTooltip />}
            contentStyle={{
              borderRadius: 12,
              border: "none",
              fontSize: 13,
            }}
          />

          {/* 📈 가격 선 */}
          <Line
            type="monotone"
            dataKey="price"
            stroke={strokeColor} // ⭐ 부모에서 내려준 색
            strokeWidth={4}
            dot={false}
            activeDot={{ r: 6 }}
            isAnimationActive={true} // ⭐ 애니메이션 ON
            animationDuration={600}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

const ChartWrapper = styled.div`
  width: 100%;
  height: 220px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 12px;
`;

export default StockChart;
