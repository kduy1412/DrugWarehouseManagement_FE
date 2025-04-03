import { Credentials } from "../types/auth";
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

export const whoAmI = (token: string) =>
  apiClient("/whoami", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
