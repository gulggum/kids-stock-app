import styled from "styled-components";
import type { ProfileAvatarType } from "../../data/static/profileAvatars";
import avatarSprite from "../../assets/avatars/avatarSprite.png";
import { getTextColorFromSkin } from "../../utils/getTextColor";
import { useUser } from "../../context/UserContext";
import { getLevelTier } from "../../utils/getLevelTier";

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
  const { user } = useUser();
  const { title } = getLevelTier(user.level);

  return (
    <Wrapper $skin={currentSkin} $text={textColor}>
      <Top>
        <ImageWrapper onClick={onClick}>
          {profileImage ? (
            <img src={profileImage} />
          ) : profileAvatar ? (
            <Sprite $x={profileAvatar.x} $y={profileAvatar.y} />
          ) : (
            <Default>🧒</Default>
          )}
        </ImageWrapper>

        <Info>
          <NameRow>
            <Name>{nickname}</Name>
            <LevelTitle>{title}</LevelTitle>
          </NameRow>
          <Level>Lv. {level}</Level>
        </Info>
      </Top>
      <Bottom>
        {" "}
        <Status>{user.status}</Status>
      </Bottom>
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
  flex-direction: column;
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
  width: 100%;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  align-items: center;
`;

const Bottom = styled.div`
  width: 100%;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

const Name = styled.div`
  font-size: 14px;
  font-weight: 800;
`;

const Level = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
`;

const Status = styled.div`
  width: 100%;
  font-size: 13px;
  line-height: 1.4;

  background: ${({ theme }) => theme.colors.background};
  padding: 10px 12px;

  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  position: relative;

  /* 말풍선 꼬리 */
  &::before {
    content: "";
    position: absolute;
    top: -5px;
    left: 16px;

    width: 10px;
    height: 10px;

    background: ${({ theme }) => theme.colors.background};

    transform: rotate(45deg);
  }
`;
const LevelTitle = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;

  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
`;
