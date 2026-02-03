//열고닫는 UI 제어 담당(뱃지 전체 보기,퀴즈 결과 팝업,확인용 안내등..)

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

export type ModalType = "CONFIRM" | "INFO";

type ModalState = {
  type: ModalType;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  customContent?: ReactNode; //옵션선택
};

type ModalContextType = {
  modal: ModalState | null;
  openModal: (modal: ModalState) => void;
  closeModal: () => void;
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
