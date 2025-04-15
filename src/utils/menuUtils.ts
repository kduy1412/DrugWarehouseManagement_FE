import { Roles } from "../types/enums/roles";
import { MenuRoutes } from "../types/menuRoutes";

export const filterMenuByRole = (
  menu: MenuRoutes[],
  role: Roles | null
): MenuRoutes[] => {
  if (!role) return [];
  return menu
    .filter(
      (item) =>
        (item.allowedroles.includes(role) && item.element) ||
        item.allowedroles.includes(Roles.Public)
    )
    .map((item) => ({
      ...item,
      children: item.children
        ? filterMenuByRole(item.children, role)
        : undefined,
    }));
};
