import { createContext, useContext, useEffect, useState } from "react";
import styled from "styled-components";

type Toast = {
  id: number;
  message: string;
};

type ToastContextType = {
  createToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType>({} as ToastContextType);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  //토스트 생성- 외부 컴포넌트에서 호출
  const createToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
  };

  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setTimeout(() => setToasts((prev) => prev.slice(1)), 1500);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ createToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <ToastItem key={toast.id}>{toast.message}</ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};

const ToastContainer = styled.div`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
`;

const ToastItem = styled.div`
  background: ${({ theme }) => theme.colors.text};
  color: white;
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 14px;
  animation: fadeUp 0.25s ease;

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
