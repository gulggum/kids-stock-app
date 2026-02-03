import styled from "styled-components";

type ModalPopupProps = {
  title?: string; //상단제목(제외가능)
  message?: string; //본문 메세지
  confirmText?: string; //버튼 텍스트(기본:확인)
  cancelText?: string;
  onConfirm: () => void; //확인 버튼 클릭시 실행
  onCancel?: () => void; //취소 버튼 클릭시 실행
  customContent?: React.ReactNode; //옵션선택
  hideActions?: boolean; //customContent가 있으면 ModalPopup의 하단 버튼 숨기기위함
};

const ModalPopup = ({
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
  customContent,
  hideActions,
}: ModalPopupProps) => {
  return (
    <Overlay>
      <Modal>
        {title && <Title>{title}</Title>}
        {message && <Message>{message}</Message>}

        {/* 선택옵션 */}
        {customContent && (
          <CustomContentWrapper>{customContent}</CustomContentWrapper>
        )}
        {!hideActions && (
          <ButtonGroup>
            {onCancel && (
              <CancelButton onClick={onCancel}>{cancelText}</CancelButton>
            )}
            <ConfirmButton onClick={onConfirm}>{confirmText}</ConfirmButton>
          </ButtonGroup>
        )}
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
  flex: 1;
  padding: 12px 0;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;

  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};

  font-size: 14px;
  font-weight: 800;
  cursor: pointer;

  transition: transform 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
  &:active {
    transform: scale(0.97);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  margin-top: 12px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px 0;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;

  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};

  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
    transform: translateY(-1px);
  }
`;
const CustomContentWrapper = styled.div`
  margin: 12px 0 4px;
  width: 100%;
`;
