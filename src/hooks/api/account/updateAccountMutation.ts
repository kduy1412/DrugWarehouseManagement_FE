import { useMutation } from "@tanstack/react-query";
import { UserPutRequest } from "../../../types/user";
import { updateAccount } from "../../../api/endpoints/user";
import { notification } from "antd";
import { queryClient } from "../../../lib/queryClient";
import { AUTH_QUERY_KEY } from "../../../types/constants";

interface UpdateAccountMutationProps {
  data: UserPutRequest;
  onSuccessCallback: (data: UserPutRequest) => void;
}

export const useUpdateAccountMutation = () =>
  useMutation<unknown, Error, UpdateAccountMutationProps>({
    mutationFn: ({ data }: UpdateAccountMutationProps) => updateAccount(data),
    onSuccess: (_, variables) => {
      notification.success({
        message: "Cập nhật thông tin thành công",
      });
      const { data, onSuccessCallback } = variables;
      onSuccessCallback(data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      notification.error({
        message: "Cập nhật thông tin không thành công",
        description: error.message ?? "Lỗi không xác định",
      });
    },
  });
