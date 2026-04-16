import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useUser } from "../../context/UserContext";
import { useModal } from "../../context/UIContext/ModalContext";
import { useReward } from "../../context/RewardContext";

type ExpBarCardProps = {
  level: number;
  currentExp: number;
  neededExp: number;
  progress: number;
};
// 레벨별 코인 헬퍼
const getLevelUpCoin = (level: number) => {
  if (level <= 3) return 30;
  if (level <= 5) return 50;
  if (level <= 7) return 80;
  return 120; // 8~10
};

const ExpBarCard = ({
  level,
  currentExp,
  neededExp,
  progress,
}: ExpBarCardProps) => {
  const { expInfo, user } = useUser();
  const { openModal } = useModal(); // ← 추가
  const { giveCustomReward } = useReward();
  const [displayProgress, setDisplayProgress] = useState(progress);

  useEffect(() => {
    console.log(
      "progress:",
      progress,
      "displayProgress:",
      displayProgress,
      "expInfo.progress:",
      expInfo.progress,
    );
    if (expInfo.progress < 20 && displayProgress > 50) {
      setDisplayProgress(100);

      setTimeout(() => {
        setDisplayProgress(expInfo.progress);

        // ✅ 레벨업 팝업 + 코인 지급
        const coin = getLevelUpCoin(expInfo.level);
        openModal({
          type: "INFO",
          customContent: (
            <LevelUpContent>
              <LevelUpEmoji>🎉</LevelUpEmoji>
              <LevelUpTitle>레벨 업!</LevelUpTitle>
              <LevelUpBadge>
                Lv.{expInfo.level} {expInfo.title}
              </LevelUpBadge>
              <LevelUpDesc>축하해요! 한 단계 성장했어요 ✨</LevelUpDesc>
              <LevelUpReward>
                <RewardChip>🪙 +{coin} 코인 지급!</RewardChip>
              </LevelUpReward>
            </LevelUpContent>
          ),
          confirmText: "야호!",
          onConfirm: () => {
            giveCustomReward({ coin });
          },
        });
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
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
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
const LevelUpContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
`;

const LevelUpEmoji = styled.div`
  font-size: 48px;
  animation: ${pulse} 0.6s ease-in-out;
`;

const LevelUpTitle = styled.div`
  font-size: 22px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
`;

const LevelUpBadge = styled.div`
  padding: 6px 16px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 13px;
  font-weight: 800;
`;

const LevelUpDesc = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LevelUpReward = styled.div`
  margin-top: 4px;
`;

const RewardChip = styled.div`
  padding: 8px 20px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary + "15"};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  font-weight: 900;
`;
