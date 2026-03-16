//설명모달(InfoModal = 컨테이너 , 내용 => 각상황에 맞게 페이지에서 디자인)
// 📁 InfoModal.tsx
// 설명용 모달 (경제 설명, UI 설명 등)

import { createPortal } from "react-dom";
import styled from "styled-components";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  buttonText?: string;
};

const InfoModal = ({
  open,
  title,
  onClose,
  children,
  buttonText = "확인",
}: Props) => {
  if (!open) return null;

  return createPortal(
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        {title && <Title>{title}</Title>}

        <Content>{children}</Content>

        <CloseButton onClick={onClose}>{buttonText}</CloseButton>
      </Modal>
    </Overlay>,
    document.body,
  );
};

export default InfoModal;

/* ================= 스타일 ================= */

const Overlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.35);

  display: grid;
  place-items: center;

  padding: 20px;

  z-index: 9999;
`;

const Modal = styled.div`
  background: white;

  padding: 24px 20px;

  border-radius: ${({ theme }) => theme.radius.lg};

  width: 300px;
  max-width: 90vw;

  display: flex;
  flex-direction: column;
  gap: 16px;

  text-align: center;

  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 800;
`;

const Content = styled.div`
  font-size: 14px;
  line-height: 1.6;
`;

const CloseButton = styled.button`
  padding: 12px;

  border: none;
  border-radius: 999px;

  background: ${({ theme }) => theme.colors.primary};
  color: white;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.96);
  }
`;
