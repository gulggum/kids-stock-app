import { useState } from "react";
import styled from "styled-components";

/**
 * 커뮤니티 상태(한마디)를 선택하는 모달
 * - 자유 입력 ❌
 * - 선택형 문구만 제공
 */
const STATUS_OPTIONS = [
  "😄 오늘은 지켜보는 날이에요",
  "🔥 계속 도전 중이에요!",
  "🐢 천천히 해도 괜찮죠?",
  "😬 아직 조금 어려워요",
];

const SelectStatusModal = ({
  onConfirm,
}: {
  onConfirm: (status: string) => void;
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Wrapper>
      <Title>오늘의 한마디를 골라볼까?</Title>

      {STATUS_OPTIONS.map((text) => (
        <Option
          key={text}
          $selected={selected === text}
          onClick={() => setSelected(text)}
        >
          {text}
        </Option>
      ))}
      <ConfirmButton
        disabled={!selected}
        onClick={() => {
          if (!selected) return;
          onConfirm(selected); // ✅ 여기서 "진짜 값" 전달
        }}
      >
        확인
      </ConfirmButton>
    </Wrapper>
  );
};

export default SelectStatusModal;

/* ================= 스타일 ================= */

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 800;
  text-align: center;
`;

const Option = styled.button<{ $selected?: boolean }>`
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;

  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.surface};

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;
`;
const ConfirmButton = styled.button<{ disabled?: boolean }>`
  margin-top: 12px;
  padding: 14px 0;
  width: 100%;

  border-radius: ${({ theme }) => theme.radius.lg};
  border: none;

  font-size: 15px;
  font-weight: 800;

  /* ✅ 선택 전 / 후 색상 구분 */
  background: ${({ disabled, theme }) =>
    disabled ? theme.colors.border : theme.colors.primary};

  color: ${({ disabled, theme }) =>
    disabled ? theme.colors.textSecondary : "#fff"};

  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;

  /* 🎮 선택 완료 느낌 */
  &:active {
    transform: ${({ disabled }) => (disabled ? "none" : "scale(0.97)")};
  }

  /* ✨ 선택 가능할 때만 살짝 강조 */
  ${({ disabled, theme }) =>
    !disabled &&
    `
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);

      &:hover {
        background: ${theme.colors.primary ?? theme.colors.primary};
      }
    `}
`;
