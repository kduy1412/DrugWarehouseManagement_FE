import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

export interface NotificationModel {
  notificationId: number;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationGetResponse extends PaginationModelResponse {
  items: NotificationModel[];
}

export interface NotificationGetRequest
  extends PaginationModelRequest,
    Record<any, any> {}
