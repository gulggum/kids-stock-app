import styled from "styled-components";

type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    value?: number;
  }[];
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload[0]?.value) return null;
  return (
    <TooltipCard>
      <TooltipPrice>{payload[0].value.toLocaleString()}원</TooltipPrice>
    </TooltipCard>
  );
};
const TooltipCard = styled.div`
  background: white;
  padding: 8px 12px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  font-size: 13px;
`;

const TooltipPrice = styled.div`
  font-weight: 700;
`;

export default CustomTooltip;
