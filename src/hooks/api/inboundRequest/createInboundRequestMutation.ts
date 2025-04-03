import { useMutation } from "@tanstack/react-query";
import { InboundRequestPostRequest } from "../../../types/inboundRequest";
import { createInboundRequest } from "../../../api/endpoints/inboundRequest";
import { notification } from "antd";

export const useCreateInboundRequestMutation = () => {
  return useMutation<unknown, Error, InboundRequestPostRequest>({
    mutationFn: (inboundRequestData: InboundRequestPostRequest) =>
      createInboundRequest(inboundRequestData),
    onSuccess: () => {
      notification.success({
        message: "Tạo phiếu đặt hàng thành công!",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Error creating inbound request",
        description: error.message,
      });
    },
  });
};