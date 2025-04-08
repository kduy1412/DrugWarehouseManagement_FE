import { Roles, RolesAsNum, RolesAsString } from "../types/enums/roles";

export const parseRolesNameToVietnamese = (
  status: RolesAsString | Roles
): string => {
  const roles =
    typeof status === "string" ? (RolesAsNum[status] as Roles) : status;
  switch (roles) {
    case Roles.Admin:
      return "Quản Trị Viên";
    case Roles.InventoryManager:
      return "Quản Lý Kho";
    case Roles.Accountant:
      return "Kế Toán";
    case Roles.SaleAdmin:
      return "Quản Lý Bán Hàng";
    case Roles.Director:
      return "Giám Đốc";
    default:
      return "Không xác định";
  }
};
