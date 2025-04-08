import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { WarehousePutRequest } from "../../../types/warehouse";
import { updateWarehouse } from "../../../api/endpoints/warehouse";

interface WarehousePutRequestMutation {
  warehouseId: number;
  data: WarehousePutRequest;
}

export const usePutWarehouseMutation = () =>
  useMutation<unknown, Error, WarehousePutRequestMutation>({
    mutationFn: ({ warehouseId, data }: WarehousePutRequestMutation) =>
      updateWarehouse(data, warehouseId),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Kho đã được cập nhật thành công",
        placement: "topRight",
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể cập nhật kho",
        placement: "topRight",
      });
    },
  });
