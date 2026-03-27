import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useSkinItem } from "../../context/SkinItemContext";
import { useToast } from "../../context/UIContext/ToastContext";
import { playCoinSound } from "../../utils/sounds";
import { useModal } from "../../context/UIContext/ModalContext";
import { MYSTERY_BOX_PRICE } from "../../data/static/cardSkins";

export const MysteryBox = () => {
  const { openMysteryBox } = useSkinItem();
  const { createToast } = useToast();
  const { openModal } = useModal();

  const [opening, setOpening] = useState(false);
  const [reward, setReward] = useState<any>(null);

  const sparkles = Array.from({ length: 18 });
  return (
    <>
      {/* 랜덤박스 카드 */}
      <Card
        onClick={() => {
          openModal({
            type: "CONFIRM",
            title: "랜덤 박스를 열까요?",
            message: `🎁 랜덤 아이템 : \n${MYSTERY_BOX_PRICE} 코인`,
            confirmText: "열기",
            cancelText: "취소",
            onConfirm: () => {
              const item = openMysteryBox();

              if (item === "NOT_ENOUGH_COIN") {
                createToast("코인이 부족해요 🥲");
                return;
              }

              if (!item) {
                createToast("더 이상 얻을 아이템이 없어요!");
                return;
              }

              setOpening(true);

              setTimeout(() => {
                setOpening(false);
                setReward(item);
                if (item.rarity === "LEGEND") {
                  createToast("🌟 LEGEND 아이템 획득!");
                }

                playCoinSound();
                if (item.duplicate) {
                  createToast(`🔁 ${item.name} 중복! 코인 +50`);
                } else {
                  createToast(`🎉 ${item.name} 획득!`);
                }
              }, 900);
            },
          });
        }}
      >
        <Emoji>🎁</Emoji>
        <Name>랜덤 박스</Name>
        <Price>100 코인</Price>
        <OpenText>열어보기</OpenText>
      </Card>

      {/* 박스 흔들림 연출 */}
      {opening && (
        <Overlay>
          <BoxAnimation>🎁</BoxAnimation>
          <BoxText>열리는 중...</BoxText>
        </Overlay>
      )}

      {/* 아이템 등장 */}
      {reward && (
        <Overlay onClick={() => setReward(null)}>
          {/* ⭐ LEGEND일 때만 반짝이 */}
          {reward.rarity === "LEGEND" && (
            <Sparkles>
              {sparkles.map((_, i) => (
                <Sparkle
                  key={i}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                >
                  ✨
                </Sparkle>
              ))}
            </Sparkles>
          )}

          <RewardCard>
            {/* ❌ 제거 */}
            {/* <RewardEmoji>{reward.emoji}</RewardEmoji> */}

            <PreviewCard>
              <CardImage $skin={reward} />
              <PreviewName>{reward.name}</PreviewName>
            </PreviewCard>

            <RewardText>획득했습니다!</RewardText>

            <ConfirmButton onClick={() => setReward(null)}>확인</ConfirmButton>

            {reward.rarity === "LEGEND" && <BorderLight />}
          </RewardCard>
        </Overlay>
      )}
    </>
  );
};

const shake = keyframes`
0% { transform: rotate(0deg); }
25% { transform: rotate(6deg); }
50% { transform: rotate(-6deg); }
75% { transform: rotate(4deg); }
100% { transform: rotate(0deg); }
`;

const pop = keyframes`
0% { transform: scale(0.5); opacity:0; }
100% { transform: scale(1); opacity:1; }
`;
const sparkle = keyframes`
0% { opacity: 0; transform: scale(0.5); }
50% { opacity: 1; transform: scale(1); }
100% { opacity: 0; transform: scale(0.5); }
`;

const rotateLight = keyframes`
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 16px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
  }
`;

const Emoji = styled.div`
  font-size: 32px;
`;

const Name = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

const Price = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
`;

const OpenText = styled.div`
  margin-top: 10px;

  padding: 6px 12px;
  border-radius: 999px;

  font-size: 12px;
  font-weight: 700;

  background: ${({ theme }) => theme.colors.primary};
  color: white;

  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.15);
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.45);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  z-index: 1000;
`;

const BoxAnimation = styled.div`
  font-size: 72px;
  animation: ${shake} 0.6s infinite;
`;

const BoxText = styled.div`
  margin-top: 16px;
  font-weight: 700;
  color: white;
`;
const RewardCard = styled.div`
  position: relative;
  background: white;
  border-radius: 20px;

  padding: 32px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  animation: ${pop} 0.35s ease;

  overflow: hidden;
`;

const RewardText = styled.div`
  font-size: 14px;
  color: #666;
  z-index: 1;
`;
const ConfirmButton = styled.button`
  z-index: 1;
  margin-top: 12px;

  padding: 8px 16px;
  border: none;
  border-radius: 999px;

  font-size: 13px;
  font-weight: 700;

  background: ${({ theme }) => theme.colors.primary};
  color: white;

  cursor: pointer;

  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15);

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.15);
  }
`;

const Sparkles = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;
const Sparkle = styled.div`
  position: absolute;
  font-size: 20px;
  animation: ${sparkle} 1.6s infinite;
`;
const BorderLight = styled.div`
  position: absolute;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    transparent,
    #ffd700,
    #fff7a8,
    #ffd700,
    transparent
  );

  animation: ${rotateLight} 3s linear infinite;

  top: -50%;
  left: -50%;

  opacity: 0.6;
  z-index: 0;
`;

const PreviewCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  margin-bottom: 8px;
`;

const PreviewName = styled.div`
  font-size: 13px;
  font-weight: 700;
`;

const CardImage = styled.div<{ $skin: any }>`
  width: 120px;
  height: 80px;
  border-radius: 12px;

  background: ${({ $skin }) =>
    $skin.gradient
      ? $skin.gradient
      : `url(${$skin.image}) center/cover no-repeat`};

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  position: relative;
  overflow: hidden;
  z-index: 555;
  /* ✨ 살짝 어둡게 (텍스트 대비용) */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.1);
  }
`;
