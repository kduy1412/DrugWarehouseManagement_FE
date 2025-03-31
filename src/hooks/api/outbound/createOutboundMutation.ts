import { useMutation } from "@tanstack/react-query";
import { OutboundPostRequest } from "../../../types/outbound";
import { createOutbound } from "../../../api/endpoints/outbound";
import { notification } from "antd";

export const useCreateOutboundMutation = () => {
  return useMutation<unknown, Error, OutboundPostRequest>({
    mutationFn: (outboundData: OutboundPostRequest) =>
      createOutbound(outboundData),
    onSuccess: () => {
      notification.success({
        message: "Tạo đơn xuất kho thành công",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Error creating outbound",
        description: error.message,
      });
    },
  });
};
