import { useMutation } from "@tanstack/react-query";
import { OutboundPostRequest } from "../../../types/outbound";
import { createOutbound } from "../../../api/endpoints/outbound";
import { notification } from "antd";
import { queryClient } from "../../../lib/queryClient";

export const useCreateOutboundMutation = () => {
  return useMutation<unknown, Error, OutboundPostRequest>({
    mutationFn: (outboundData: OutboundPostRequest) =>
      createOutbound(outboundData),
    onSuccess: () => {
      notification.success({
        message: "Tạo đơn xuất kho thành công",
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
        message: "Tạo đơn xuất kho thất bại",
        description: error.message,
      });
    },
  });
};
