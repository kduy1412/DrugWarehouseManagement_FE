import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import RootPage from "../components/RootPage";
import LayoutComponent from "../components/LayoutComponent";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/auth/login";
import { MenuRoutes } from "../types/menuRoutes";
import { privateRoutes } from "./privateRoutes";
import HomePage from "../pages/HomePage";
import ErrorPage from "../error";

const generateRoutes = (menu: MenuRoutes[]) => {
  return menu.map((route) => (
    <Route
      key={route.key}
      path={route.url}
      element={route.element || <RootPage />}
    >
      {route.children && generateRoutes(route.children)}
    </Route>
  ));
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<LayoutComponent />}>
          <Route index element={<RootPage />} />
          {generateRoutes(privateRoutes)}
          <Route index element={<HomePage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Route>
    </>
  )
);
