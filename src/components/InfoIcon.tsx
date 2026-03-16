/**
 * 📁 InfoIcon.tsx
 *
 * 설명 모달을 열 때 사용하는 도움말 아이콘
 *
 * 사용 예
 * <InfoIcon onClick={() => setOpen(true)} />
 *
 * 특징
 * - 앱 전체에서 동일한 스타일
 * - 접근성 고려 (button 사용)
 */

import styled from "styled-components";

type Props = {
  onClick?: (e: React.MouseEvent) => void;
};

const InfoIcon = ({ onClick }: Props) => {
  return <IconButton onClick={onClick}>❓</IconButton>;
};

export default InfoIcon;

/* ================= 스타일 ================= */

const IconButton = styled.button`
  margin-left: 6px;

  width: 18px;
  height: 18px;

  border-radius: 50%;
  border: none;

  background: ${({ theme }) => theme.colors.surface};

  font-size: 11px;
  font-weight: 700;

  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.text};

  opacity: 0.8;

  transition:
    transform 0.15s ease,
    opacity 0.15s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;
