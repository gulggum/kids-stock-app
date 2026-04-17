//릭터 페이지 → 내 카드 → 집 탭에서 보여주는 아이템
import styled from "styled-components";
import type { House } from "../../data/static/house";

type Props = {
  house: House;
  isEquipped: boolean;
  locked: boolean;
  onClick: () => void;
};

const HouseItem = ({ house, isEquipped, locked, onClick }: Props) => {
  return (
    <Wrapper $selected={isEquipped} $locked={locked} onClick={onClick}>
      {/* 🏷 뱃지 이미지 */}
      <BadgeWrap>
        <img src={house.badge} alt={house.name} />
      </BadgeWrap>

      <Name>{house.name}</Name>

      <Status>
        {locked
          ? `🔒 Lv.${house.requiredLevel}`
          : isEquipped
            ? "⭐ 착용중"
            : "착용하기"}
      </Status>
    </Wrapper>
  );
};

export default HouseItem;

/* ================= 스타일 ================= */
const Wrapper = styled.div<{ $selected?: boolean; $locked?: boolean }>`
  min-width: 120px;
  padding: 12px 10px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.card};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  border: ${({ $selected, theme }) =>
    $selected ? `2px solid ${theme.colors.primary}` : "none"};

  ${({ $selected }) =>
    $selected &&
    `
    box-shadow:
      0 0 0 2px rgba(80,120,255,0.3),
      0 8px 20px rgba(80,120,255,0.35);
    transform: scale(1.03);
  `}

  ${({ $locked }) =>
    $locked &&
    `
    opacity: 0.5;
    filter: grayscale(1);
  `}

  transition: 0.2s;
  &:hover {
    transform: translateY(-3px);
  }
`;

const BadgeWrap = styled.div`
  width: 52px;
  height: 90px;

  svg {
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Name = styled.div`
  font-size: 12px;
  font-weight: 700;
  text-align: center;
`;

const Status = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
`;
