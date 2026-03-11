import styled from "styled-components";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const InfoModal = ({ open, onClose, children }: Props) => {
  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>{children}</Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.3);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 100;
`;

const Modal = styled.div`
  background: white;

  padding: 20px;

  border-radius: ${({ theme }) => theme.radius.md};

  width: 260px;

  font-size: 14px;
  line-height: 1.5;

  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export default InfoModal;
