import { InboundStatus, InboundStatusAsString } from "../types/inbound";

export const parseInboundStatusToVietnamese = (
  status: string,
  isAccountant = false
): string => {
  switch (status) {
    case InboundStatusAsString[InboundStatus.Pending]:
      return isAccountant ? "Chờ kế toán duyệt" : "Chờ thủ kho báo cáo";
    case InboundStatusAsString[InboundStatus.InProgress]:
      return "Đang tiến hành";
    case InboundStatusAsString[InboundStatus.Completed]:
      return "Hoàn thành";
    case InboundStatusAsString[InboundStatus.Cancelled]:
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};
