import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { InboundPostRequest } from "../../../types/inbound";
import { createInbound } from "../../../api/endpoints/inbound";

export const useCreateInboundMutation = (isNotified = true) => {
  return useMutation<unknown, Error, InboundPostRequest>({
    mutationFn: (inboundData: InboundPostRequest) => createInbound(inboundData),
    onSuccess: () => {
      if (isNotified)
        notification.success({
          message: "Tạo phiếu nhập thành công!",
        });
    },
    onError: (error) => {
      notification.error({
        message: "Tạo phiếu nhập không thành công",
        description: error.message ?? "Lỗi đã xảy ra",
      });
    },
  });
};
