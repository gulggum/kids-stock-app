import styled from "styled-components";
import type { ProfileAvatarType } from "../../data/static/profileAvatars";
import avatarSprite from "../../assets/avatars/avatarSprite.png";

/**
 * ✅ 캐릭터 선택 확인 UI
 */
type Props = {
  avatar: ProfileAvatarType;
};

const ConfirmAvatar = ({ avatar }: Props) => {
  return (
    <Wrapper>
      <Preview>
        <Sprite $x={avatar.x} $y={avatar.y} />
      </Preview>
      <Text>이 캐릭터로 변경할까요?</Text>
    </Wrapper>
  );
};

export default ConfirmAvatar;

/* ================= 스타일 ================= */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Preview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  padding: 6px;

  background: ${({ theme }) => theme.colors.surface};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
  font-size: 14px;
`;

const Sprite = styled.div<{ $x: number; $y: number }>`
  width: 64px;
  height: 64px;

  background-image: url(${avatarSprite});
  background-repeat: no-repeat;
  border-radius: 10px;

  background-size: 500% 300%;
  background-position: ${({ $x, $y }) =>
    `${($x / 4) * 100}% ${($y / 2) * 100}%`};
`;
