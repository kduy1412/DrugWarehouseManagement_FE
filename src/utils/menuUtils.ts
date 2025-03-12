import { Roles } from "../types/enums/roles";
import { MenuItem } from "../types/menuItems";

export const filterMenuByRole = (menu: MenuItem[], role: Roles): MenuItem[] => {
  return menu
    .filter((item) => item.allowedRoles.includes(role) && item.element)
    .map((item) => ({
      ...item,
      children: item.children
        ? filterMenuByRole(item.children, role)
        : undefined,
    }));
};
