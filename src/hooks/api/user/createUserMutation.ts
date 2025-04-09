import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { createAccount } from "../../../api/endpoints/user";
import { UserPostRequest } from "../../../types/user";

export const useCreateUserMutation = () =>
  useMutation<unknown, Error, UserPostRequest>({
    mutationFn: (data: UserPostRequest) => createAccount(data),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Tài khoản đã được tạo thành công",
        placement: "topRight",
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
