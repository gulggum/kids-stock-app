// 오늘의 지식 팝업 컴포넌트
// - useKnowledge 훅에서 받은 지식 표시
// - 확인 버튼 클릭 시 보상 지급

import styled, { keyframes } from "styled-components";
import { createPortal } from "react-dom";
import type { Knowledge } from "../data/static/Knowledgedata";

type Props = {
  knowledge: Knowledge;
  onConfirm: () => void;
  onClose: () => void;
  isDone: boolean; // 오늘 이미 봤는지
};

const KnowledgePopup = ({ knowledge, onConfirm, onClose, isDone }: Props) => {
  return createPortal(
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Badge>💡 오늘의 지식 한 스푼</Badge>
        <Title>{knowledge.title}</Title>
        <Content>{knowledge.content}</Content>

        {isDone ? (
          // 이미 봤으면 닫기만
          <>
            <DoneText>✅ 오늘 지식 완료!</DoneText>
            <CloseButton onClick={onClose}>닫기</CloseButton>
          </>
        ) : (
          // 아직 안 봤으면 확인 + 보상
          <ConfirmButton onClick={onConfirm}>
            오~ 나 좀 똑똑해진 듯?! 😎
          </ConfirmButton>
        )}
      </Modal>
    </Overlay>,
    document.body,
  );
};

export default KnowledgePopup;

/* ================= 스타일 ================= */

const popIn = keyframes`
  0% { opacity: 0; transform: scale(0.85) translateY(20px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 9999;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 28px 24px;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  animation: ${popIn} 0.35s ease;
`;

const Badge = styled.div`
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.3;
`;

const Content = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.surface};
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  width: 100%;
`;

const ConfirmButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 15px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: transform 0.15s ease;
  &:active {
    transform: scale(0.97);
  }
`;

const DoneText = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const CloseButton = styled.button`
  width: 100%;
  padding: 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: none;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.muted};
`;
