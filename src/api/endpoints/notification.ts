import apiClient from "..";
import { NotificationGetRequest } from "../../types/notification";

export const getAllNotification = (query: NotificationGetRequest) => {
  const queryString = new URLSearchParams(query).toString();

  return apiClient(`/api/Account/notifications?${queryString}`, {
    method: "GET",
  });
};

export const markAllNotificationAsRead = () =>
  apiClient(`/api/Account/read-notifications`, {
    method: "POST",
  });
