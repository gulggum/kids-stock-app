import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Home from "../pages/Home";
import Market from "../pages/market/Market";
import Portfolio from "../pages/Portfolio";
import Community from "../pages/Community";
import Shop from "../pages/Shop";
import StockDetail from "../pages/market/StockDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "market", element: <Market /> },
      { path: "market/:id", element: <StockDetail /> },
      { path: "portfolio", element: <Portfolio /> },
      { path: "community", element: <Community /> },
      { path: "shop", element: <Shop /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
