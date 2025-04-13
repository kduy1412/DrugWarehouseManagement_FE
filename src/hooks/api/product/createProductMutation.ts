import { MutationFunction, useMutation } from "@tanstack/react-query";
import {
  ProductGetRequestParams,
  ProductPostRequest,
} from "../../../types/product";
import { CreateProduct } from "../../../api/endpoints/product";
import { notification } from "antd";
import { queryClient } from "../../../lib/queryClient";
export const CreateProductMutation = () => {
  return useMutation<unknown, Error, ProductPostRequest>({
    mutationFn: (data: ProductPostRequest) => CreateProduct(data),
    onSuccess: () => {
      notification.success({
        message: "Tạo sản phẩm thành công!",
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("product"),
      });
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi tạo sản phẩm",
        description: error.message,
      });
    },
  });
};
