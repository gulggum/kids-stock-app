import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styled, { useTheme } from "styled-components";
import CustomTooltip from "./CustomTooltip";

export type ChartPoint = {
  date: string; // x축 (날짜 or 인덱스)
  price: number; // y축 (가격)
};

type StockChartProps = {
  data: ChartPoint[]; // 차트에 그릴 데이터
  strokeColor: string; // 선 색 (상승/하락에 따라 부모에서 결정)
  country: "KR" | "US";
  period: "7d" | "30d";
};
// 최고/최저 커스텀 Dot
const CustomDot = (props: any) => {
  const theme = useTheme();
  const { cx, cy, value, data, country } = props;

  const isUS = country === "US";
  if (!data || data.length === 0) return null;

  const prices = data.map((d: ChartPoint) => d.price).filter(Boolean);
  const max = Math.max(...prices);
  const min = Math.min(...prices);

  const isMax = value === max;
  const isMin = value === min;

  if (!isMax && !isMin) return null;

  const isTop = isMax || isMin; // 최고가는 위에, 최저가는 아래에 라벨
  const color = isMax ? theme.colors.up : theme.colors.down;

  return (
    <g>
      {/* 점 */}
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={color}
        stroke="#fff"
        strokeWidth={2}
      />
      {/* 라벨 */}
      <>
        <text
          x={cx}
          y={isTop ? cy - 20 : cy + 28}
          textAnchor="middle"
          fontSize={10}
          fontWeight={700}
          fill={color}
        >
          {isMax ? "최고" : "최저"}
        </text>

        <text
          x={cx}
          y={isTop ? cy - 8 : cy + 40}
          textAnchor="middle"
          fontSize={11}
          fontWeight={800}
          fill={color}
        >
          {isUS ? `$${value.toLocaleString()}` : `${value.toLocaleString()}원`}
        </text>
      </>
    </g>
  );
};

const StockChart = ({
  data,
  country,
  period,
  strokeColor,
}: StockChartProps) => {
  return (
    <ChartWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 55, bottom: 20, left: 15, right: 15 }}
        >
          {/* 📅 X축: 날짜 (간단히 표시) */}
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={(date) => {
              const d = new Date(date);
              return `${d.getMonth() + 1}/${d.getDate()}`; // "4/7" 형식으로 짧게
            }}
            interval={period === "30d" ? Math.ceil(data.length / 5) : 0}
            padding={{ left: 10, right: 10 }}
            tickMargin={20}
          />

          {/* 📐 Y축: 숫자 숨김 (아이용 UX) */}
          <YAxis hide domain={["auto", "auto"]} />

          {/* 💬 툴팁: 눌렀을 때 가격만 보여줌 */}
          <Tooltip
            content={<CustomTooltip country={country} />}
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
            stroke="#22C55E"
            strokeOpacity={0.9}
            strokeWidth={4}
            // ✅ 커스텀 Dot — 최고/최저만 표시
            dot={(props) => (
              <CustomDot
                {...props}
                data={data}
                strokeColor={strokeColor}
                country={country}
              />
            )}
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
  height: 250px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
`;

export default StockChart;
