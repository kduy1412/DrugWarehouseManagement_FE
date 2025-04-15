import { useMutation } from "@tanstack/react-query";
import { InboundPutRequest } from "../../../types/inbound";
import { updateInbound } from "../../../api/endpoints/inbound";
import { notification } from "antd";

export const useApprovedReportMutation = () =>
  useMutation<unknown, Error, InboundPutRequest>({
    mutationFn: (data: InboundPutRequest) => updateInbound(data),
    onSuccess: () => {
      notification.success({
        message: "Duyệt đơn thành công",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Duyệt đơn thất bại",
        description: error.message ?? "Lỗi không xác định",
      });
    },
  });
