import { useQuery } from "@tanstack/react-query";
import { getAllNotification } from "../../../api/endpoints/notification";
import {
  NotificationGetRequest,
  NotificationGetResponse,
} from "../../../types/notification";

export const useGetAllNotificationQuery = (query: NotificationGetRequest) =>
  useQuery<NotificationGetResponse, Error, NotificationGetResponse>({
    queryFn: () => getAllNotification(query),
    queryKey: ["notifications"],
  });
