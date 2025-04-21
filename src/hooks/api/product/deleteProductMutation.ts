import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { queryClient } from "../../../lib/queryClient";
import { removeProduct } from "../../../api/endpoints/product";

export const useDeleteProductMutation = () =>
  useMutation<unknown, Error, number>({
    mutationFn: (productId: number) => removeProduct(productId),
    onSuccess: () => {
      notification.success({
        message: "Xóa thành công",
        description: "Sản phẩm đã được xóa thành công",
        placement: "topRight",
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("product"),
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể xóa sản phẩm",
        placement: "topRight",
      });
    },
  });
