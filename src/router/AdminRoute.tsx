import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

/**
 * 관리자 전용 라우트 보호
 *
 * isLoading 중에는 절대 리다이렉트 하지 않음
 * → DB에서 role 불러오기 전에 튕기는 버그 방지
 */

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>로딩중..</div>;

  // 🔥 핵심: 로그인 여부 = user.id
  if (!user.id) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
