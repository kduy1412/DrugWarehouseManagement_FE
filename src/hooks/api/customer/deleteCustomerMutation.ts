import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { queryClient } from "../../../lib/queryClient";
import { removeCustomer } from "../../../api/endpoints/customer";

export const useDeleteCustomerMutation = () =>
  useMutation<unknown, Error, number>({
    mutationFn: (customerId: number) => removeCustomer(customerId),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Khách hàng đã được xóa thành công",
        placement: "topRight",
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("customer"),
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể xóa khách hàng",
        placement: "topRight",
      });
    },
  });
