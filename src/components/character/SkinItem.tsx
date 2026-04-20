import styled from "styled-components";

/**
 * 🎴 카드 아이템
 */
type Props = {
  skin: any;
  isSelected: boolean;
  locked: boolean;
  onClick: () => void;
};

const SkinItem = ({ skin, isSelected, locked, onClick }: Props) => {
  return (
    <Wrapper $selected={isSelected} $locked={locked} onClick={onClick}>
      <Preview $skin={skin} />

      <Name>{skin.name}</Name>

      <Status>
        {locked
          ? `🔒 Lv.${skin.unlockLevel}`
          : isSelected
            ? "⭐ 사용중"
            : "적용하기"}
      </Status>
    </Wrapper>
  );
};

export default SkinItem;

/* 스타일 */

const Wrapper = styled.div<{ $selected?: boolean; $locked?: boolean }>`
  min-width: 140px;
  padding: 10px;
  border-radius: 12px;

  background: ${({ theme }) => theme.colors.card};

  cursor: pointer;

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
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const Preview = styled.div<{ $skin: any }>`
  height: 70px;
  border-radius: 10px;

  background: ${({ $skin }) =>
    $skin.gradient ? $skin.gradient : `url(${$skin.image}) center/cover`};
`;

const Name = styled.div`
  font-size: 13px;
  font-weight: 700;
  margin: 5px 0px;
`;

const Status = styled.div`
  font-size: 12px;
`;
