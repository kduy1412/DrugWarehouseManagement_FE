import { useMutation } from "@tanstack/react-query";
import { InboundPutStatusRequest } from "../../../types/inbound";
import { updateInboundStatus } from "../../../api/endpoints/inbound";
import { notification } from "antd";

interface InboundPutStatusRequestParams {
  data: InboundPutStatusRequest;
}
export const useUpdateInboundStatusMutation = () =>
  useMutation<unknown, Error, InboundPutStatusRequestParams>({
    mutationFn: ({ data }: InboundPutStatusRequestParams) =>
    updateInboundStatus(data),
    onSuccess: () => {
      notification.success({
        message: "Cập nhật thành công",
        // description: `Đã phê duyệt thành công yêu cầu nhập hàng`,
        placement: "topRight",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi cập nhật",
        // description: error.message || "Đã xảy ra lỗi khi phê duyệt yêu cầu nhập hàng",
        placement: "topRight",
      });
    },
  });
