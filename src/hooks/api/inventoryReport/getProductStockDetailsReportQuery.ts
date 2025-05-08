import { useMutation } from "@tanstack/react-query";
import { ProductStockDetailsReportRequest } from "../../../types/inventoryReport";
import { ProductStocksDetailsReport } from "../../../api/endpoints/inventoryReport";
import { notification } from "antd";

export const useGetProductStockDetailsReport = (
  onSuccessCallback: (blob: Blob) => void
) => {
  return useMutation<unknown, Error, ProductStockDetailsReportRequest>({
    mutationFn: (query: ProductStockDetailsReportRequest) =>
      ProductStocksDetailsReport(query),
    onSuccess: (data) => {
      notification.success({
        message: "Tạo danh sách tồn kho thành công",
      });
      onSuccessCallback(data as Blob);
    },
    onError: (error) => {
      notification.error({
        message: "Tạo danh sách tồn kho không thành công",
        description: error.message ?? "Lôi không xác định khi tạo danh sách",
      });
    },
  });
};
