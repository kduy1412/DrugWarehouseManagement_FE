import { Credentials } from "../types/auth";
import apiClient from "./index";

export const login = (credentials: Credentials) =>
  apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const refreshToken = (refreshToken: string) =>
  apiClient("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

export const logout = () =>
  apiClient("/auth/logout", {
    method: "POST",
  });
