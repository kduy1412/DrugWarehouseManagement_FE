import { InboundStatus, InboundStatusAsString } from "../types/inbound";

export const parseInboundStatusToVietnamese = (status: string): string => {
  switch (status) {
    case InboundStatusAsString[InboundStatus.Pending]:
      return "Chờ thủ kho báo cáo";
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
