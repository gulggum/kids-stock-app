import styled from "styled-components";

type ChartPeriodToggleProps = {
  value: "7d" | "1y";
  onChange: (value: "7d" | "1y") => void;
};

const ChartPeriodToggle = ({ value, onChange }: ChartPeriodToggleProps) => {
  return (
    <Wrapper>
      <Button $active={value === "7d"} onClick={() => onChange("7d")}>
        7일
      </Button>
      <Button $active={value === "1y"} onClick={() => onChange("1y")}>
        30일
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: inline-flex;
  background: ${(props) => props.theme.colors.card};
  border-radius: ${(props) => props.theme.radius.lg};
  padding: 4px;
  gap: 4px;
`;

const Button = styled.button<{ $active: boolean }>`
  border: none;
  padding: 6px 14px;
  border-radius: ${(props) => props.theme.radius.md};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? "#fff" : theme.colors.textSecondary};
  transition: all 0.15s ease;
`;

export default ChartPeriodToggle;
