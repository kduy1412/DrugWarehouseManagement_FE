import { useMutation } from "@tanstack/react-query";
import { CategoryPutRequest } from "../../../types/category";
import { updateCategory } from "../../../api/endpoints/category";
import { notification } from "antd";

export const useUpdateCategoryMutation = () =>
  useMutation<unknown, Error, CategoryPutRequest>({
    mutationFn: (data: CategoryPutRequest) => updateCategory(data),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Thông tin danh mục đã được cập nhật thành công",
        placement: "topRight",
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể cập nhật thông tin danh mục",
        placement: "topRight",
      });
    },
  });
