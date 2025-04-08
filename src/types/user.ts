import { Roles } from "./enums/roles";
import { PaginationModelRequest } from "./paginationModelRequest";
import { PaginationModelResponse } from "./paginationModelResponse";

// GET
export interface UserGetResponse extends PaginationModelResponse {
  items: User[];
}

export interface User {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  roleId: number;
  roleName: string;
  status: UserStatus;
  twoFactorEnabled: boolean;
  phoneNumberConfirmed: boolean;
  emailConfirmed: boolean;
  accountSettings: null;
}

// GET-PARAMS
export interface UserGetRequestParams
  extends PaginationModelRequest,
    UserFilterParams,
    Record<string, any> {}

export interface UserFilterParams {
  Search?: string | null;
  DateFrom?: string | null;
  DateTo?: string | null;
}

// POST
export interface UserPostRequest {
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  roleId: Roles;
}

// PUT
export interface UserPutRequest {
  userName: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  twoFactorEnabled: boolean;
  phoneNumberConfirmed: boolean;
}

export interface UserPutPasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// VIEW
export type UserGetResponseView = Pick<
  User,
  "userName" | "email" | "fullName" | "phoneNumber" | "roleName" | "status"
>;

// STATUS
export type UserStatus = "Active" | "Inactive" | "Deleted";

export const UserStatusAsNum: Record<UserStatus, number> = {
  Active: 1,
  Inactive: 2,
  Deleted: 3,
};

export const UserStatusColor = [
  "var(--status-active)",
  "var(--status-inactive)",
  "var(--status-deleted)",
];
