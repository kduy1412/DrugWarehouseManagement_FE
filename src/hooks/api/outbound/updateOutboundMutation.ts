import { useMutation } from "@tanstack/react-query";
import { OutboundPutRequest } from "../../../types/outbound";
import { updateOutbound } from "../../../api/endpoints/outbound";
import { notification } from "antd";
import { queryClient } from "../../../lib/queryClient";

interface OutboundPutRequestParams {
  id: number;
  data: OutboundPutRequest;
}
export const useUpdateOutboundMutation = () =>
  useMutation<unknown, Error, OutboundPutRequestParams>({
    mutationFn: ({ id, data }: OutboundPutRequestParams) =>
      updateOutbound(id, data),
    onSuccess: () => {
      notification.success({
        message: "Cập nhật thành công",
        description: `Đã cập nhật thành công đơn xuất`,
        placement: "topRight",
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("outbound"),
      });
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi cập nhật",
        description: error.message || "Đã xảy ra lỗi khi cập nhật đơn xuất",
        placement: "topRight",
      });
    },
  });
