import { useMutation } from "@tanstack/react-query";
import { ProviderPutRequest } from "../../../types/provider";
import { updateProvider } from "../../../api/endpoints/provider";
import { notification } from "antd";
import { queryClient } from "../../../lib/queryClient";

interface UpdateProviderMutationProps {
  providerId: number;
  data: ProviderPutRequest;
}

export const useUpdateProviderMutation = () =>
  useMutation<unknown, Error, UpdateProviderMutationProps>({
    mutationFn: ({ data, providerId }: UpdateProviderMutationProps) =>
      updateProvider(data, providerId),
    onSuccess: () => {
      notification.success({
        message: "Cập nhật thành công nhà cung cấp",
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("provider"),
      });
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi cập nhật nhà cung cấp",
        description: error.message || "Đã xảy ra lỗi khi cập nhật nhà cung cấp",
      });
    },
  });
