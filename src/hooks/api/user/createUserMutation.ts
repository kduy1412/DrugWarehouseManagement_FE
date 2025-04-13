import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { createAccount } from "../../../api/endpoints/user";
import { UserPostRequest } from "../../../types/user";
import { queryClient } from "../../../lib/queryClient";

export const useCreateUserMutation = () =>
  useMutation<unknown, Error, UserPostRequest>({
    mutationFn: (data: UserPostRequest) => createAccount(data),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Tài khoản đã được tạo thành công",
        placement: "topRight",
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("users"),
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể tạo tài khoản",
        placement: "topRight",
      });
    },
  });
