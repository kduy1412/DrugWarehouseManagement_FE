import { useMutation } from "@tanstack/react-query";
import { OutboundReturnRequest } from "../../../types/outbound";
import { createReturnOutbound } from "../../../api/endpoints/outbound";
import { notification } from "antd";
import { queryClient } from "../../../lib/queryClient";

export const useCreateReturnOutboundMutation = () =>
  useMutation<unknown, Error, OutboundReturnRequest>({
    mutationFn: (data: OutboundReturnRequest) => createReturnOutbound(data),
    onSuccess: () => {
      notification.success({
        message: "Tạo yêu cầu hoàn thành công",
        description: "Yêu cầu trả hàng outbound đã được tạo thành công",
        placement: "topRight",
      });
            queryClient.invalidateQueries({
              predicate: (query) => query.queryKey.includes("outbound"),
            });
            queryClient.invalidateQueries({
              predicate: (query) => query.queryKey.includes("lot"),
            });
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi khi tạo yêu cầu",
        description:
          error.message || "Đã xảy ra lỗi khi tạo yêu cầu trả hàng outbound",
        placement: "topRight",
      });
    },
  });
