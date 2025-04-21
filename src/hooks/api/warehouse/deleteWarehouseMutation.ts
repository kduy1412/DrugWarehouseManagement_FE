import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { queryClient } from "../../../lib/queryClient";
import { removeWarehouse } from "../../../api/endpoints/warehouse";

export const useDeleteWarehouseMutation = () =>
  useMutation<unknown, Error, number>({
    mutationFn: (warehouseId: number) => removeWarehouse(warehouseId),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Kho đã được xóa thành công",
        placement: "topRight",
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("warehouse"),
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể xóa kho",
        placement: "topRight",
      });
    },
  });
