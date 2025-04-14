import { useMutation } from "@tanstack/react-query";
import { createInboundReport } from "../../../api/endpoints/inboundReport";
import { notification } from "antd";

export const useCreateInboundReportMutation = () =>
  useMutation<unknown, Error, FormData>({
    mutationFn: (data: FormData) => createInboundReport(data),
    onSuccess: () => {
      notification.success({
        message: "Tạo báo cáo nhập kho thành công",
      });
    },
  });
