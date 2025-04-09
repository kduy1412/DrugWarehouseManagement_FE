import { useMutation } from "@tanstack/react-query";
import { CategoryPostRequest } from "../../../types/category";
import { createCategory } from "../../../api/endpoints/category";
import { notification } from "antd";

export const useCreateCategoryMutation = () =>
  useMutation<unknown, Error, CategoryPostRequest>({
    mutationFn: (data: CategoryPostRequest) => createCategory(data),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Danh mục đã được tạo thành công",
        placement: "topRight",
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể tạo danh mục",
        placement: "topRight",
      });
    },
  });