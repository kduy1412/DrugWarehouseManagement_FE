import { useMutation } from "@tanstack/react-query";
import { CustomerPostRequest } from "../../../types/customer";
import { createCustomer } from "../../../api/endpoints/customer";
import { notification } from "antd";
import { queryClient } from "../../../lib/queryClient";

export const useCreateCustomerMutation = () =>
  useMutation<unknown, Error, CustomerPostRequest>({
    mutationFn: (data: CustomerPostRequest) => createCustomer(data),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Khách hàng đã được tạo thành công",
        placement: "topRight",
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("customer"),
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể tạo khách hàng",
        placement: "topRight",
      });
    },
  });
