import apiClient from "..";
import { UpdateAccountConfigInformation } from "../../types/auth";
import {
  UserGetRequestParams,
  UserPostRequest,
  UserPutPasswordRequest,
  UserPutRequest,
} from "../../types/user";

export const createAccount = (data: UserPostRequest) =>
  apiClient("/api/Admin/createAccount", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const changePassword = (data: UserPutPasswordRequest) =>
  apiClient("/api/Account/changePassword", {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const resetPassword = (id: string) =>
  apiClient(`/api/Admin/resetPassword/${id}`, {
    method: "POST",
  });

export const updateAccount = (data: UserPutRequest) =>
  apiClient("/api/Account/updateAccount", {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const removeAccount = (accountId: number) =>
  apiClient(`/api/Admin/deleteAccount/${accountId}`, {
    method: "DELETE",
  });

export const getAccounts = (
  query: UserGetRequestParams = { Page: 1, PageSize: 10 }
) => {
  const queryString = new URLSearchParams(query).toString();

  return apiClient(`/api/Admin/getAccounts?${queryString}`, {
    method: "GET",
  });
};

export const updateAccountConfigInformation = (
  data: UpdateAccountConfigInformation
) =>
  apiClient(`/api/Account/updateAccount`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
