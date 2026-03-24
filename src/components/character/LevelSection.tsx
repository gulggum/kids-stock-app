import styled from "styled-components";

/**
 * ⭐ 레벨 표시 영역
 */
type Props = {
  level: number;
  currentExp: number;
  neededExp: number;
  percent: number;
};

const LevelSection = ({ level, currentExp, neededExp, percent }: Props) => {
  return (
    <Wrapper>
      <LevelText>⭐ Lv.{level}</LevelText>

      <Bar>
        <Fill $value={percent} />
      </Bar>

      <ExpText>
        {currentExp} / {neededExp} EXP
      </ExpText>
    </Wrapper>
  );
};

export default LevelSection;

/* ================= 스타일 ================= */

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 16px;

  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const LevelText = styled.div`
  font-weight: 800;
`;

const Bar = styled.div`
  height: 10px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  overflow: hidden;
`;

const Fill = styled.div<{ $value: number }>`
  width: ${({ $value }) => `${$value}%`};
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
`;

const ExpText = styled.div`
  font-size: 12px;
  text-align: right;
`;
