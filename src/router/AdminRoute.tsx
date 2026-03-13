import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * 관리자 전용 페이지 접근 보호
 * 로그인 + 관리자 여부 확인
 */
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();

  // ⭐ 개발중이라 일단 로그인만 확인
  // 나중에 role === admin 추가 가능

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
