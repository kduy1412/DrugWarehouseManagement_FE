import { useMutation } from "@tanstack/react-query";
import { UserPutPasswordRequest } from "../../../types/user";
import { changePassword } from "../../../api/endpoints/user";
import { notification } from "antd";

interface ChangeAccountPasswordMutationProps {
  data: UserPutPasswordRequest;
}

export const useChangeAccountPasswordMutationProps = () =>
  useMutation<unknown, Error, ChangeAccountPasswordMutationProps>({
    mutationFn: ({ data }: ChangeAccountPasswordMutationProps) =>
      changePassword(data),
    onSuccess: () => {
      notification.success({
        message: "Cập nhật mật khẩu thành công",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Cập nhật mật khẩu không thành công",
        description: error.message ?? "Lỗi không xác định",
      });
    },
  });
