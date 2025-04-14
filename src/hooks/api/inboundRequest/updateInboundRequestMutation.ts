import { useMutation } from "@tanstack/react-query";
import { InboundRequestPutRequest } from "../../../types/inboundRequest";
import { updateInboundRequestStatus } from "../../../api/endpoints/inboundRequest";
import { notification } from "antd";
import { queryClient } from "../../../lib/queryClient";

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
        placement: "topRight",
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("inboundRequest"),
      });
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi cập nhật",
        description:
          error.message || "Đã xảy ra lỗi khi phê duyệt yêu cầu nhập hàng",
        placement: "topRight",
      });
    },
  });
