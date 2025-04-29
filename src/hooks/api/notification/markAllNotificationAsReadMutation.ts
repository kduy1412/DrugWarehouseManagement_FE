import { useMutation } from "@tanstack/react-query";
import { markAllNotificationAsRead } from "../../../api/endpoints/notification";
import { queryClient } from "../../../lib/queryClient";

export const useMarkAllNotificationAsReadMutation = () =>
  useMutation({
    mutationFn: () => markAllNotificationAsRead(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
