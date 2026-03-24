import styled from "styled-components";
import type { ProfileAvatarType } from "../../data/static/profileAvatars";
import avatarSprite from "../../assets/avatars/avatarSprite.png";
import { getTextColorFromSkin } from "../../utils/getTextColor";

/**
 * 👤 프로필 카드
 * - 프로필 이미지 / 캐릭터 표시
 * - 클릭 시 프로필 변경 모달 열림 //유저얼굴+닉네임+클릭 역할만 담당
 */
type Props = {
  nickname: string;
  profileAvatar: ProfileAvatarType | null;
  profileImage: string | null;
  level: number;
  currentSkin: any;
  onClick: () => void;
};

const ProfileCard = ({
  nickname,
  profileAvatar,
  profileImage,
  onClick,
  level,
  currentSkin,
}: Props) => {
  //배경밝기 계산해서 색 바꾸기
  const textColor = getTextColorFromSkin(currentSkin);

  return (
    <Wrapper $skin={currentSkin} $text={textColor}>
      <ImageWrapper onClick={onClick}>
        {profileImage ? (
          <img src={profileImage} />
        ) : profileAvatar ? (
          <Sprite $x={profileAvatar.x} $y={profileAvatar.y} />
        ) : (
          <Default>🧒</Default>
        )}
      </ImageWrapper>
      <Top>
        <Level>Lv.{level}</Level>
      </Top>
      <Nickname>{nickname}</Nickname>
    </Wrapper>
  );
};

export default ProfileCard;

/* ================= 스타일 ================= */

const Wrapper = styled.div<{ $skin: any; $text: string }>`
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 20px;
  background: ${({ $skin }) =>
    $skin?.gradient ? $skin.gradient : `url(${$skin?.image}) center/cover`};

  color: ${({ $text }) => $text};
  display: flex;
  align-items: center;
  gap: 16px;

  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const ImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Nickname = styled.div`
  font-size: 18px;
  font-weight: 800;
`;

const Default = styled.div`
  font-size: 24px;
`;

const Sprite = styled.div<{ $x: number; $y: number }>`
  width: 100%;
  height: 100%;

  background-image: url(${avatarSprite});
  background-repeat: no-repeat;
  border-radius: 10px;

  background-size: 500% 300%;
  background-position: ${({ $x, $y }) =>
    `${($x / 3.95) * 100}% ${($y / 2) * 100}%`};
`;
const Top = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Level = styled.div`
  font-size: 14px;
  font-weight: 700;
`;
