import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { UpdateProduct } from "../../../api/endpoints/product";
import { ProductPutRequest } from "../../../types/product";
import { queryClient } from "../../../lib/queryClient";

interface CreateProductMutationProps {
  productId: number;
  data: ProductPutRequest;
}

export const useUpdateProductMutation = () => {
  return useMutation<unknown, Error, CreateProductMutationProps>({
    mutationFn: ({ data, productId }: CreateProductMutationProps) =>
      UpdateProduct(data, productId),
    onSuccess: () => {
      notification.success({
        message: "Cập nhật sản phẩm thành công!",
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("product"),
      });
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi cập nhật sản phẩm",
        description: error.message,
      });
    },
  });
};
