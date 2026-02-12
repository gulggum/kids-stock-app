import { ModalProvider } from "./ModalContext";
import { ToastProvider } from "./ToastContext";

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ModalProvider>
      <ToastProvider>{children}</ToastProvider>
    </ModalProvider>
  );
};
