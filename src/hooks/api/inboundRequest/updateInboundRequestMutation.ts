import { useMutation } from "@tanstack/react-query";
import { InboundRequestPutRequest } from "../../../types/inboundRequest";
import { updateInboundRequestStatus } from "../../../api/endpoints/inboundRequest";
import { notification } from "antd";

interface InboundRequestPutRequestParams {
  data: InboundRequestPutRequest;
}
export const useUpdateInboundRequestMutation = () =>
  useMutation<unknown, Error, InboundRequestPutRequestParams>({
    mutationFn: ({ data }: InboundRequestPutRequestParams) =>
      updateInboundRequestStatus(data),
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
        description: error.message || "Đã xảy ra lỗi khi phê duyệt yêu cầu nhập hàng",
        placement: "topRight",
      });
    },
  });
