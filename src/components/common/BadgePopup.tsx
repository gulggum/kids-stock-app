import styled, { keyframes } from "styled-components";
import { BADGES, type BadgeId } from "../../data/bades";

// 팝업 등장 애니메이션
const pop = keyframes`
  0% { transform: translate(-50%, -10px) scale(0.9); opacity: 0; }
  100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
`;

// 실제 렌더되는 팝업 컴포넌트
const BadgePopup = ({ badgeId }: { badgeId: BadgeId }) => {
  const badge = BADGES[badgeId];

  return (
    <Wrapper>
      <Emoji>{badge.emoji}</Emoji>
      <Title>배지를 획득했어요!</Title>
      <Name>{badge.title}</Name>
      <Desc>{badge.description}</Desc>
    </Wrapper>
  );
};

export default BadgePopup;

/* ===================== 스타일 ===================== */

const Wrapper = styled.div`
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);

  padding: 18px 22px;
  border-radius: ${({ theme }) => theme.radius.lg};

  background: ${({ theme }) => theme.colors.primary};
  color: #fff;

  text-align: center;
  font-weight: 800;

  animation: ${pop} 0.3s ease;
  z-index: 300;
`;

const Emoji = styled.div`
  font-size: 28px;
  margin-bottom: 6px;
`;

const Title = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
`;

const Name = styled.div`
  font-size: 16px;
`;

const Desc = styled.div`
  margin-top: 4px;
  font-size: 12px;
  font-weight: 500;
  opacity: 0.9;
`;
