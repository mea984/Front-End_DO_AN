import { useRoutes, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import publicRoutes from "./PublicRoute";
import privateRoutes from "./PrivateRouter";
import { useSelector } from "react-redux";
import { selectIsLogin } from "../redux/slice/userSlice";

const isAuthenticated = () => {
  const isLogin = useSelector(selectIsLogin);
  return isLogin; // Hoặc false nếu không đăng nhập
};

const PublicRoute = ({ children }) => {
  return children ? children : <Navigate to="/login" />;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const location = useLocation();

  // Cuộn lên đầu mỗi khi route thay đổi
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  const routes = [
    ...publicRoutes.map((route) => ({
      ...route,
      element: <PublicRoute>{route.element}</PublicRoute>,
    })),
    ...privateRoutes.map((route) => ({
      ...route,
      element: <PrivateRoute>{route.element}</PrivateRoute>,
    })),
  ];

  return useRoutes(routes);
};

export default AppRoutes;
