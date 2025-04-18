import { InventoryCheckStatus } from "../types/inventoryCheck";

export const parseInventoryCheckStatus = (
  status: InventoryCheckStatus,
  isReasonParse = false
) => {
  switch (status) {
    case InventoryCheckStatus.Damaged:
      return isReasonParse ? "Hàng bị hỏng" : "Hỏng";
    case InventoryCheckStatus.Excess:
      return isReasonParse ? "Hàng bị thừa" : "Thừa";
    case InventoryCheckStatus.Found:
      return isReasonParse ? "Đã tìm thấy" : "Đã tìm thấy";
    case InventoryCheckStatus.Lost:
      return isReasonParse ? "Hàng bị mất" : "Mất";
    default:
      return "Trạng thái không phù hợp";
  }
};
