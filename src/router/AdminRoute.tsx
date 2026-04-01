import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading, user } = useUser();

  if (isLoading) return null;

  // 로그인 안 했으면 로그인 페이지로
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 관리자 아니면 홈으로
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
