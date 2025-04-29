import { ConfirmSetup2FAPostRequest, Credentials } from "../types/auth";
import { UserPutRequest } from "../types/user";
import apiClient from "./index";

export const login = (credentials: Credentials) =>
  apiClient("/api/Account/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const refreshToken = (refreshToken: string) =>
  apiClient("/api/Account/refreshToken", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

export const whoAmI = (token: string | null, isTokenRequired = true) =>
  isTokenRequired
    ? apiClient("/whoami", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    : apiClient("/whoami", {
        method: "GET",
      });

export const updateUser = (data: UserPutRequest) =>
  apiClient(`/api/Account/updateAccount`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const setUp2FA = () =>
  apiClient(`/api/Account/setupTwoFactorAuthenticator`, {
    method: "POST",
  });

export const confirmSetup2FA = (data: ConfirmSetup2FAPostRequest) =>
  apiClient(`/api/Account/confirmSetup2FA`, {
    method: "POST",
    body: JSON.stringify(data),
  });
