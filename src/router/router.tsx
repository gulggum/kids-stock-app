import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Home from "../pages/Home";
import Market from "../pages/market/Market";
import Community from "../pages/Community";
import Shop from "../pages/Shop";
import StockDetail from "../pages/market/StockDetail";
import PortfolioPage from "../pages/PortfolioPage";
import CharacterPage from "../pages/CharacterPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import NotFoundPage from "../pages/NotFoundPage";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminNewsCreate from "../pages/admin/AdminNewsCreate";
import AdminRanking from "../pages/admin/AdminRanking";
import AdminItems from "../pages/admin/AdminItems";
import AdminStats from "../pages/admin/AdminStats";
import ResetPasswordPage from "../pages/ResetPasswordPage";

export const router = createBrowserRouter([
  // ⭐ 로그인
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  // ⭐ 사용자 앱
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "market", element: <Market /> },
      { path: "market/:id", element: <StockDetail /> },
      { path: "portfolio", element: <PortfolioPage /> },
      { path: "community", element: <Community /> },
      { path: "shop", element: <Shop /> },
      {
        path: "character",
        element: <CharacterPage />,
      },
    ],
  },
  // ⭐ 관리자 페이지(별도 분리)
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "news", element: <AdminNewsCreate /> },
      { path: "ranking", element: <AdminRanking /> },
      { path: "items", element: <AdminItems /> },
      { path: "stats", element: <AdminStats /> },
    ],
  },

  // ⭐ 404 없는 경로시
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
