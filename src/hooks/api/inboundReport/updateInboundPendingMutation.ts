import { useMutation } from "@tanstack/react-query";
import { InboundReportPutRequest } from "../../../types/inboundReport";
import { updateInboundPendingReport } from "../../../api/endpoints/inboundReport";
import { notification } from "antd";

export const useUpdateInboundPendingMutation = () =>
  useMutation<unknown, Error, InboundReportPutRequest>({
    mutationFn: (data: InboundReportPutRequest) => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }
      return updateInboundPendingReport(formData);
    },
    onSuccess: () => {
      notification.success({
        message: "Cập nhật báo cáo thành công",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Cập nhật báo cáo thất bại",
        description: error.message ?? "Không xác định được lỗi",
      });
    },
  });
