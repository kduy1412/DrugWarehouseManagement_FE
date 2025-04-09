import { useMutation } from "@tanstack/react-query";
import { CategoryPutRequest } from "../../../types/category";
import {
  removeCategory,
  updateCategory,
} from "../../../api/endpoints/category";
import { notification } from "antd";

export const useRemoveCategoryMutation = () =>
  useMutation<unknown, Error, number>({
    mutationFn: (categoryId: number) => removeCategory(categoryId),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Thông tin danh mục đã được xóa",
        placement: "topRight",
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể xóa thông tin danh mục",
        placement: "topRight",
      });
    },
  });
