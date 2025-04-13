import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { WarehousePostRequest } from "../../../types/warehouse";
import { createWarehouse } from "../../../api/endpoints/warehouse";
import { queryClient } from "../../../lib/queryClient";

export const useCreateWarehouseMutation = () =>
  useMutation<unknown, Error, WarehousePostRequest>({
    mutationFn: (data: WarehousePostRequest) => createWarehouse(data),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Kho đã được tạo thành công",
        placement: "topRight",
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("warehouse"),
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể tạo kho",
        placement: "topRight",
      });
    },
  });
