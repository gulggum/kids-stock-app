import styled, { keyframes } from "styled-components";

type ModalPopupProps = {
  title?: string; //상단제목(제외가능)
  message?: string; //본문 메세지
  confirmText?: string; //버튼 텍스트(기본:확인)
  onConfirm: () => void; //확인 버튼 클릭시 실행
};

const ModalPopup = ({
  title,
  message,
  confirmText = "확인",
  onConfirm,
}: ModalPopupProps) => {
  return (
    <Overlay>
      <Modal>
        {title && <Title>{title}</Title>}

        <Message>{message}</Message>

        <ConfirmButton onClick={onConfirm}>{confirmText}</ConfirmButton>
      </Modal>
    </Overlay>
  );
};

export default ModalPopup;

/* ===================== 스타일 ===================== */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 999;
`;

const Modal = styled.div`
  width: 280px;
  padding: 24px 20px;

  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};

  box-shadow: ${({ theme }) => theme.shadows.md};

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;

  animation: pop 0.25s ease-out;

  @keyframes pop {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 800;
  margin: 0;
`;

const Message = styled.div`
  font-size: 14px;
  text-align: center;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

const ConfirmButton = styled.button`
  margin-top: 6px;

  padding: 10px 20px;
  width: 100%;

  border-radius: ${({ theme }) => theme.radius.md};
  border: none;

  background: ${({ theme }) => theme.colors.primary};
  color: white;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;
