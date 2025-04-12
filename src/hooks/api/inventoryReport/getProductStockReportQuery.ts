import { useMutation } from "@tanstack/react-query";
import { ProductStockReportRequest } from "../../../types/inventoryReport";
import { ProductStockReport } from "../../../api/endpoints/inventoryReport";
import { notification } from "antd";

export const useGetProductStockReport = (
  onSuccessCallback: (blob: Blob) => void
) => {
  return useMutation<unknown, Error, ProductStockReportRequest>({
    mutationFn: (query: ProductStockReportRequest) => ProductStockReport(query),
    onSuccess: (data) => {
      notification.success({
        message: "Tạo báo cáo sản phẩm trong kho thành công",
      });
      onSuccessCallback(data as Blob)
    },
    onError: (error) => {
      notification.error({
        message: "Tạo báo cáo sản phẩm trong kho không thành công",
        description: error.message ?? "Lôi không xác định khi tạo báo cáo",
      });
    },
  });
};
