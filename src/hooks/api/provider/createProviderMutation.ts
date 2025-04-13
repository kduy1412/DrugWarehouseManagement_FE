import { useMutation } from "@tanstack/react-query";
import { ProviderPostRequest } from "../../../types/provider";
import { createProvider } from "../../../api/endpoints/provider";
import { notification } from "antd";
import { queryClient } from "../../../lib/queryClient";

export const useCreateProviderMutation = () =>
  useMutation<unknown, Error, ProviderPostRequest>({
    mutationFn: (data: ProviderPostRequest) => createProvider(data),
    onSuccess: () => {
      notification.success({
        message: "Tạo thành công nhà cung cấp",
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("provider"),
      });
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi tạo nhà cung cấp",
        description: error.message || "Đã xảy ra lỗi khi tạo nhà cung cấp",
      });
    },
  });
