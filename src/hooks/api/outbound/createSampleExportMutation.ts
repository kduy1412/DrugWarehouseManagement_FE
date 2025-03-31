import { SampleExportRequest } from "../../../types/outbound";
import { createSampleExport } from "../../../api/endpoints/outbound";
import { notification } from "antd";
import { useMutation } from "@tanstack/react-query";

export const useCreateSampleExportMutation = () => {
  return useMutation<unknown, Error, SampleExportRequest>({
    mutationFn: (data: SampleExportRequest) => createSampleExport(data),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Tạo đơn xuất mẫu thành công!",
        placement: "topRight",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi tạo đơn xuất mẫu",
        placement: "topRight",
      });
    },
  });
};
