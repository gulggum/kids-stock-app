import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useReward } from "../context/RewardContext";
import { useToast } from "../context/UIContext/ToastContext";

type Ad = {
  id: number;
  emoji: string;
  title: string;
  desc: string;
  duration: number;
  reward: number;
};

const ADS: Ad[] = [
  {
    id: 1,
    emoji: "🎮",
    title: "게임 광고",
    desc: "신나는 게임을 만나보세요!",
    duration: 15,
    reward: 30,
  },
  {
    id: 2,
    emoji: "📚",
    title: "교육 광고",
    desc: "재미있는 학습 앱이에요!",
    duration: 15,
    reward: 30,
  },
  {
    id: 3,
    emoji: "🍕",
    title: "음식 광고",
    desc: "맛있는 음식을 주문해요!",
    duration: 15,
    reward: 30,
  },
  {
    id: 4,
    emoji: "⭐",
    title: "프리미엄 광고",
    desc: "30초 시청하고 더 많은 코인!",
    duration: 30,
    reward: 50,
  },
] as const;

const AD_REWARD = 30;
const MAX_AD = 3;

const AdWatchPage = () => {
  const navigate = useNavigate();
  const { giveCustomReward } = useReward();
  const { createToast } = useToast();

  const [selected, setSelected] = useState<number | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const [adCount, setAdCount] = useState(() => {
    const saved = localStorage.getItem("adCount");
    const savedDate = localStorage.getItem("adDate");
    const today = new Date().toISOString().slice(0, 10);
    if (savedDate !== today) return 0;
    return saved ? parseInt(saved) : 0;
  });

  const handleSelect = (ad: Ad) => {
    if (adCount >= MAX_AD) {
      createToast("오늘 광고는 모두 봤어요! 내일 다시 도전해요 😊");
      return;
    }
    setSelected(ad.id);
    setTimer(ad.duration);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setTimer(null);
          setDone(true);
          const newCount = adCount + 1;
          setAdCount(newCount);
          localStorage.setItem("adCount", String(newCount));
          localStorage.setItem("adDate", new Date().toISOString().slice(0, 10));
          giveCustomReward({ coin: ad.reward, exp: 0 }); // ← 광고별 보상
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate("/shop")}>← 뒤로</BackButton>
        <Title>광고 보고 코인 받기 📺</Title>
      </Header>

      <InfoBox>
        <InfoText>광고를 선택하고 시청하면 코인을 받을수 있어요!</InfoText>
        <CountText>
          {adCount}/{MAX_AD} 완료 · 15초 30🪙 / 30초 50🪙
        </CountText>
      </InfoBox>

      {done ? (
        <ResultBox>
          <ResultEmoji>🎉</ResultEmoji>
          <ResultText>+{AD_REWARD} 코인 획득!</ResultText>
          <ResultButton
            onClick={() => {
              setDone(false);
              setSelected(null);
            }}
          >
            {adCount < MAX_AD ? "다시 보기" : "완료!"}
          </ResultButton>
          <BackShopButton onClick={() => navigate("/shop")}>
            상점으로 돌아가기
          </BackShopButton>
        </ResultBox>
      ) : selected !== null ? (
        <WatchingBox>
          <AdEmoji>{ADS.find((a) => a.id === selected)?.emoji}</AdEmoji>
          <WatchingText>광고 시청 중...</WatchingText>
          <TimerText>{timer}초</TimerText>
          <TimerBar $ratio={(15 - (timer ?? 0)) / 15} />
        </WatchingBox>
      ) : (
        <AdList>
          {ADS.map((ad) => (
            <AdCard
              key={ad.id}
              onClick={() => handleSelect(ad)}
              $disabled={adCount >= MAX_AD}
            >
              <AdEmoji>{ad.emoji}</AdEmoji>
              <AdInfo>
                <AdTitle>{ad.title}</AdTitle>
                <AdDesc>{ad.desc}</AdDesc>
              </AdInfo>
              <AdReward>+{AD_REWARD} 🪙</AdReward>
            </AdCard>
          ))}
        </AdList>
      )}
    </Wrapper>
  );
};

export default AdWatchPage;

/* ===== 스타일 ===== */

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100dvh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.button`
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 800;
`;

const InfoBox = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
`;

const CountText = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const AdList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AdCard = styled.div<{ $disabled: boolean }>`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const AdEmoji = styled.div`
  font-size: 32px;
`;

const AdInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AdTitle = styled.div`
  font-size: 14px;
  font-weight: 800;
`;

const AdDesc = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const AdReward = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const WatchingBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

const WatchingText = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const TimerText = styled.div`
  font-size: 48px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const TimerBar = styled.div<{ $ratio: number }>`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ $ratio }) => `${$ratio * 100}%`};
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 999px;
    transition: width 1s linear;
  }
`;

const ResultBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

const ResultEmoji = styled.div`
  font-size: 56px;
`;

const ResultText = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const ResultButton = styled.button`
  padding: 12px 32px;
  border-radius: 999px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
`;

const BackShopButton = styled.button`
  padding: 10px 24px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: none;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;
