import styled from "styled-components";
import {
  profileAvatars,
  type ProfileAvatarType,
} from "../../data/static/profileAvatars";
import avatarSprite from "../../assets/avatars/avatarSprite.png";

/**
 * 🧒 캐릭터 선택 리스트
 */
type Props = {
  onSelect: (avatar: ProfileAvatarType) => void;
};

const AvatarGrid = ({ onSelect }: Props) => {
  return (
    <Grid>
      {profileAvatars.map((avatar) => (
        <Item key={avatar.id} onClick={() => onSelect(avatar)}>
          <Sprite $x={avatar.x} $y={avatar.y} />
        </Item>
      ))}
    </Grid>
  );
};

export default AvatarGrid;

/* ================= 스타일 ================= */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const Item = styled.div`
  padding: 6px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
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
