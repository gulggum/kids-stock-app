import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useUser();

  // 세션 확인 중이면 아무것도 렌더링 안 함
  // 이게 없으면 로그인한 유저가 /login으로 튕겨버림!
  if (isLoading) return null;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
