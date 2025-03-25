import { OutboundStatus } from "../types/outbound";

export const parseOutboundStatusToVietnamese = (
  status: OutboundStatus | number
): string => {
  switch (status) {
    case OutboundStatus.Pending:
      return "Đang chờ xử lý";
    case OutboundStatus.InProgress:
      return "Đang thực hiện";
    case OutboundStatus.Cancelled:
      return "Đã hủy";
    case OutboundStatus.Completed:
      return "Hoàn thành";
    case OutboundStatus.Returned:
      return "Đã trả lại";
    default:
      return "Không xác định";
  }
};
