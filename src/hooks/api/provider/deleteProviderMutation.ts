import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { queryClient } from "../../../lib/queryClient";
import { removeProvider } from "../../../api/endpoints/provider";

export const useDeleteProviderMutation = () =>
  useMutation<unknown, Error, number>({
    mutationFn: (providerId: number) => removeProvider(providerId),
    onSuccess: () => {
      notification.success({
        message: "Xóa thành công",
        description: "Nhà cung cấp đã được xóa thành công",
        placement: "topRight",
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("provider"),
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể xóa nhà cung cấp",
        placement: "topRight",
      });
    },
  });
