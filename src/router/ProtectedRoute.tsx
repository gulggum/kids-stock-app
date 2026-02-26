import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

//페이지 접근 방어

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
