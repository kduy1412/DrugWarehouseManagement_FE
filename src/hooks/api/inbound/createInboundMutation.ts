import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { InboundPostRequest } from "../../../types/inbound";
import { createInbound } from "../../../api/endpoints/inbound";

export const useCreateInboundMutation = () => {
  return useMutation<unknown, Error, InboundPostRequest>({
    mutationFn: (inboundData: InboundPostRequest) =>
      createInbound(inboundData),
    onSuccess: () => {
      notification.success({
        message: "Tạo phiếu nhập thành công!",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Error creating inbound",
        description: error.message,
      });
    },
  });
};