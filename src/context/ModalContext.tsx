import { createContext, useContext, useState } from "react";

type ModalState = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type ModalContextType = {
  openModal: (modal: ModalState) => void;
  closeModal: () => void;
  modal: ModalState | null;
};

const ModalContext = createContext<ModalContextType>({} as ModalContextType);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modal, setModal] = useState<ModalState | null>(null);

  const openModal = (data: ModalState) => setModal(data);
  const closeModal = () => setModal(null);

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};
