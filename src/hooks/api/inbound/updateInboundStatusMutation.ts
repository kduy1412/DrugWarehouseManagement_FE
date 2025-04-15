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
        placement: "topRight",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi cập nhật",
        placement: "topRight",
      });
    },
  });
