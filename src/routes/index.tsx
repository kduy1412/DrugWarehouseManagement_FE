import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { filterMenuByRole } from "../utils/menuUtils";
import { privateRoutes } from "./privateRoutes";
import { Roles } from "../types/enums/roles";

import { MenuItem } from "../types/menuItems";

import RootPage from "../components/RootPage";
import LayoutComponent from "../components/LayoutComponent";

export const filteredMenu = filterMenuByRole(privateRoutes, Roles.ADMIN);

const generateRoutes = (menu: MenuItem[]) => {
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
    <Route path="/" element={<LayoutComponent />}>
      <Route index element={<RootPage />} />
      {generateRoutes(filteredMenu)}
      <Route path="*" element={<RootPage />} />
    </Route>
  )
);
