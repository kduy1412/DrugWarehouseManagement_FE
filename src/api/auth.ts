import { Credentials } from "../types/auth";
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
