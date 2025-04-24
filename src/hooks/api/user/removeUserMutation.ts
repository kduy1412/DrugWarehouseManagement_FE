import { useMutation } from "@tanstack/react-query";
import { removeAccount } from "../../../api/endpoints/user";
import { notification } from "antd";
import { queryClient } from "../../../lib/queryClient";

export const useRemoveUserMutation = () =>
  useMutation<unknown, Error, number>({
    mutationFn: (accountId) => removeAccount(accountId),
    onSuccess: () => {
      notification.success({
        message: "Xóa thành công tài khoản",
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("users"),
      });
    },
    onError: (error) => {
      notification.error({
        message: "Xóa không thành công tài khoản",
        description: error.message ?? "Lỗi không xác định",
      });
    },
  });
