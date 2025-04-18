import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { InventoryCheckPostRequest } from "../../../types/inventoryCheck";
import { createInventoryCheck } from "../../../api/endpoints/inventoryCheck";
import { queryClient } from "../../../lib/queryClient";

export const useCreateInventoryCheckMutation = () => {
  return useMutation<unknown, Error, InventoryCheckPostRequest>({
    mutationFn: (data) => createInventoryCheck(data),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Đơn báo cáo kiểm kê đã được tạo thành công.",
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("inventoryCheck"),
      });
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi",
        description:
          error.message ||
          "Đã xảy ra lỗi khi tạo đơn báo cáo kiểm kê. Vui lòng thử lại.",
      });
    },
  });
};
