import { ProviderStatus } from "../types/provider";

export const parseProviderStatusToVietnamese = (
  status: ProviderStatus
): string => {
  switch (status) {
    case ProviderStatus.Active:
      return "Hoạt Động";
    case ProviderStatus.Inactive:
      return "Bị vô hiệu hóa";
    case ProviderStatus.Deleted:
      return "Đã xóa";
    default:
      return "Không xác định";
  }
};
