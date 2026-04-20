import styled, { keyframes, css } from "styled-components";
import type { ProfileAvatarType } from "../../data/static/profileAvatars";
import avatarSprite from "../../assets/avatars/avatarSprite.png";
import { getTextColorFromSkin } from "../../utils/getTextColor";
import { useUser } from "../../context/UserContext";
import { getLevelTier } from "../../utils/getLevelTier";
import { HOUSES } from "../../data/static/house";

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
  equippedHouseId: string;
};

const ProfileCard = ({
  nickname,
  profileAvatar,
  profileImage,
  onClick,
  level,
  currentSkin,
  equippedHouseId,
}: Props) => {
  //배경밝기 계산해서 색 바꾸기
  const textColor = getTextColorFromSkin(currentSkin);
  const { user } = useUser();
  const { title } = getLevelTier(user.level);

  const equippedHouse = HOUSES.find((h) => h.id === equippedHouseId);

  return (
    <Wrapper $skin={currentSkin} $text={textColor}>
      <Top>
        <ImageWrapper
          onClick={onClick}
          $isEmpty={!profileImage && !profileAvatar}
        >
          {profileImage ? (
            <img src={profileImage} />
          ) : profileAvatar ? (
            <Sprite $x={profileAvatar.x} $y={profileAvatar.y} />
          ) : (
            <Default></Default>
          )}
        </ImageWrapper>

        <Info>
          <NameRow>
            <LevelTitle $text={textColor}>{title}</LevelTitle>
            <Name>{nickname}</Name>
          </NameRow>
          <Level>Lv. {level}</Level>
        </Info>
      </Top>
      <Bottom>
        {" "}
        <Status>{user.status}</Status>
      </Bottom>
      {/* 🏠 집 뱃지 */}
      {equippedHouse && (
        <HouseBadge>
          <img src={equippedHouse.badge} alt={equippedHouse.name} />
        </HouseBadge>
      )}
    </Wrapper>
  );
};

export default ProfileCard;

/* ================= 스타일 ================= */
const borderPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0px transparent; }
  50% { box-shadow: 0 0 8px 3px rgba(99, 179, 237, 0.8); }
`;

const Wrapper = styled.div<{ $skin: any; $text: string }>`
  position: relative;
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

const ImageWrapper = styled.div<{ $isEmpty: boolean }>`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  background: white;
  cursor: pointer;
  ${({ $isEmpty }) =>
    $isEmpty &&
    css`
      animation: ${borderPulse} 2s ease-in-out infinite;
    `}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Default = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  border-radius: 12px;

  background: #f8fafc;

  &::before {
    content: "?";
    width: 36px;
    height: 36px;
    border-radius: 50%;

    background: #e2e8f0;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 20px;
    font-weight: 900;
    color: #64748b;
  }
`;

const Sprite = styled.div<{ $x: number; $y: number }>`
  width: 100%;
  height: 100%;

  background-image: url(${avatarSprite});
  background-repeat: no-repeat;
  border-radius: 10px;

  background-size: 510% 310%;
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
  flex-direction: column;
  justify-content: space-around;
  height: 50px;
  min-width: 0;
  height: 60px;
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
const LevelTitle = styled.div<{ $text: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  padding: 4px 10px;
  border-radius: 999px;

  font-size: 10px;
  font-weight: 800;

  /* ⭐ 핵심: 유리 + 뱃지 느낌 */
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);

  /* ⭐ 테두리로 뱃지 느낌 */
  border: 1px solid rgba(255, 255, 255, 0.4);

  /* ⭐ 텍스트 색은 자동 */
  color: ${({ $text }) => $text};

  /* ⭐ 살짝 떠있는 느낌 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

  /* ⭐ 살짝 반짝 느낌 */
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    opacity: 0.6;
    pointer-events: none;
  }
`;
// 스타일 추가
const HouseBadge = styled.div`
  position: absolute;
  top: 4px;
  right: 20px;
  width: 80px;
  height: 80px;
  z-index: 5;

  svg,
  img {
    width: 100%;
    height: 100%;
  }
`;
