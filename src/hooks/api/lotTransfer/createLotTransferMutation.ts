import { useMutation } from "@tanstack/react-query";
import { LotTransferPostRequest } from "../../../types/outbound";
import { createLotTransfer } from "../../../api/endpoints/lotTransfer";
import { notification } from "antd";

export const useCreateLotTransferMutation = () =>
  useMutation<unknown, Error, LotTransferPostRequest>({
    mutationFn: (data: LotTransferPostRequest) => createLotTransfer(data),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Tạo chuyển lô thành công!",
        placement: "topRight",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi tạo chuyển lô",
        placement: "topRight",
      });
    },
  });
