import { ProductStatus } from "../types/product";

export const parseProductStatusToVietNamese = (status: ProductStatus): string => {
  switch (status) {
    case ProductStatus.Active:
      return "Hoạt Động";
    case ProductStatus.Inactive:
      return "Bị Vô Hiệu";
    default:
      return "Không xác định";
  }
};
