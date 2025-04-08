import { WarehouseStatus } from "../types/warehouse";

export const parseWarehouseStatusToVietnamese = (
  status: WarehouseStatus
): string => {
  switch (status) {
    case WarehouseStatus.Active:
      return "Hoạt Động";
    case WarehouseStatus.Inactive:
      return "Bị vô hiệu hóa";
    default:
      return "Không xác định";
  }
};
