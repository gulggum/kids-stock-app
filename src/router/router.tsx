import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Home from "../pages/Home";
import Market from "../pages/market/Market";
import Community from "../pages/Community";
import Shop from "../pages/Shop";
import StockDetail from "../pages/market/StockDetail";
import PortfolioPage from "../pages/PortfolioPage";
import CharacterPage from "../pages/CharacterPage";
import SplashScreen from "../pages/LoadingPage/SplashScreen";
import LoginPage from "../pages/LoginPage";

export const router = createBrowserRouter([
  // 1️⃣ 스플래시 (첫 진입)
  {
    path: "*",
    element: <SplashScreen />,
  },

  // 2️⃣ 로그인
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/app",
    element: <AppLayout />,
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
]);

export const AppRouter = () => <RouterProvider router={router} />;
