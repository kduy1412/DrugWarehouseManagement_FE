import {
  InboundRequestStatus,
  InboundRequestStatusAsString,
} from "../types/inboundRequest";

export const parseInboundRequestStatusToVietnamese = (
  status: string
): string => {
  switch (status) {
    case InboundRequestStatusAsString[
      InboundRequestStatus.WaitingForAccountantApproval
    ]:
      return "Đang chờ kế toán phê duyệt";
    case InboundRequestStatusAsString[
      InboundRequestStatus.WaitingForDirectorApproval
    ]:
      return "Đang chờ giám đốc phê duyệt";
    case InboundRequestStatusAsString[InboundRequestStatus.InProgress]:
      return "Đang chờ kế toán tạo đơn";
    case InboundRequestStatusAsString[
      InboundRequestStatus.WaitingForSaleAdminApproval
    ]:
      return "Đang chờ quản trị bán hàng phê duyệt";
    case InboundRequestStatusAsString[InboundRequestStatus.WaitingForImport]:
      return "Đang chờ nhập kho";
    case InboundRequestStatusAsString[InboundRequestStatus.Completed]:
      return "Hoàn thành";
    case InboundRequestStatusAsString[InboundRequestStatus.Cancelled]:
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};
