import { useMutation } from "@tanstack/react-query";
import { updateCustomer } from "../../../api/endpoints/customer";
import { CustomerPutRequest } from "../../../types/customer";
import { notification } from "antd";

interface CustomerPutRequestParams {
  customerId: number;
  data: CustomerPutRequest;
}

export const useUpdateCustomerMutation = () =>
  useMutation<unknown, Error, CustomerPutRequestParams>({
    mutationFn: ({ customerId, data }: CustomerPutRequestParams) =>
      updateCustomer(customerId, data),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Thông tin khách hàng đã được cập nhật thành công",
        placement: "topRight",
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể cập nhật thông tin khách hàng",
        placement: "topRight",
      });
    },
  });
