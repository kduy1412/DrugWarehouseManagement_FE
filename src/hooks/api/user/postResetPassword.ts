import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { resetPassword } from "../../../api/endpoints/user";

export const useResetUserPasswordMutation = () =>
  useMutation<unknown, Error, string>({
    mutationFn: (userId: string) => resetPassword(userId),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Mật khẩu đã được thiết lập lại thành công",
        placement: "topRight",
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể thiết lập lại mật khẩu",
        placement: "topRight",
      });
    },
  });
