import { CustomerStatus } from "../types/customer";

export const parseCustomerStatusToVietnamese = (status: CustomerStatus): string => {
  switch (status) {
    case CustomerStatus.Active:
      return "Hoạt Động";
    case CustomerStatus.Inactive:
      return "Bị Vô Hiệu";
    default:
      return "Không xác định";
  }
};
