import { useEffect, useState } from "react";
import styled from "styled-components";
import { useUser } from "../../context/UserContext";

type ExpBarCardProps = {
  level: number;
  currentExp: number;
  neededExp: number;
  progress: number;
};

const ExpBarCard = ({
  level,
  currentExp,
  neededExp,
  progress,
}: ExpBarCardProps) => {
  const { expInfo, user } = useUser();
  const [displayProgress, setDisplayProgress] = useState(progress);
  useEffect(() => {
    if (expInfo.progress === 0 && displayProgress > 90) {
      // 👉 레벨업 순간

      setDisplayProgress(100); // 일단 꽉 채움

      setTimeout(() => {
        setDisplayProgress(0); // 그 다음 리셋
      }, 400);
    } else {
      setDisplayProgress(expInfo.progress);
    }
  }, [progress]);
  return (
    <Wrapper>
      <TopRow>
        <Level>⭐ Lv. {level}</Level>
        <ScoreBadge>🏅 {user.score}점</ScoreBadge>
      </TopRow>

      <BarWrapper>
        <Bar>
          <Fill
            $isFull={displayProgress >= 100}
            style={{ width: `${displayProgress}%` }}
          />
        </Bar>
        <ExpText>
          {currentExp} / {neededExp} EXP
        </ExpText>
      </BarWrapper>
    </Wrapper>
  );
};

export default ExpBarCard;

/* ================= 스타일 ================= */

const Wrapper = styled.div`
  padding: 15px 15px 30px 15px;

  border-radius: ${({ theme }) => theme.radius.md};

  background: ${({ theme }) => theme.colors.card};

  display: flex;
  flex-direction: column;
  gap: 10px;

  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Level = styled.div`
  font-weight: 800;
`;
const ScoreBadge = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
`;

const BarWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Bar = styled.div`
  height: 10px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
`;

const Fill = styled.div<{ $isFull: boolean }>`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.accentBlue}
  );

  transition: width 0.4s ease;

  position: relative;

  /* ✨ 기본 반짝 */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: -40px;
    width: 40px;
    height: 100%;

    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.6),
      transparent
    );

    animation: shine 1.5s infinite;
  }

  @keyframes shine {
    0% {
      right: -40px;
    }
    100% {
      right: 100%;
    }
  }

  /* 💥 100% 터지는 효과 */
  ${({ $isFull }) =>
    $isFull &&
    `
    animation: explode 0.6s ease;

    @keyframes explode {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0px rgba(255, 215, 0, 0);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 0 12px rgba(255, 215, 0, 0.9);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 0px rgba(255, 215, 0, 0);
      }
    }
  `}
`;

const ExpText = styled.div`
  position: absolute;
  right: 5px;
  top: 8px;
  margin-top: 5px;

  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;
