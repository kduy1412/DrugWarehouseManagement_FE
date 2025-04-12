import { useMutation } from "@tanstack/react-query";
import { WarehouseReportRequest } from "../../../types/inventoryReport";
import { warehouseReport } from "../../../api/endpoints/inventoryReport";
import { notification } from "antd";

export const useGetWarehouseStockReport = (
  onSuccessCallback: (blob: Blob) => void
) => {
  return useMutation<unknown, Error, WarehouseReportRequest>({
    mutationFn: (query: WarehouseReportRequest) => warehouseReport(query),
    onSuccess: (data) => {
      notification.success({
        message: "Tạo báo cáo kho thành công",
      });
      onSuccessCallback(data as Blob);
    },
    onError: (error) => {
      notification.error({
        message: "Tạo báo cáo kho không thành công",
        description: error.message ?? "Lôi không xác định khi tạo báo cáo",
      });
    },
  });
};
