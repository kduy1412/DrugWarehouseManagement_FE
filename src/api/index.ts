import { redirect } from "react-router-dom";
import { queryClient } from "../lib/queryClient";
import { AuthResponse } from "../types/auth";
import { AUTH_QUERY_KEY } from "../types/constants";
import { refreshToken } from "./auth";
import { notification } from "antd";

const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const authData = queryClient.getQueryData<AuthResponse>(AUTH_QUERY_KEY);
  const accessToken = authData?.token;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  let response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
    config
  );

  /**Token Expired */
  if (response.status === 401) {
    const refreshData = queryClient.getQueryData<AuthResponse>(AUTH_QUERY_KEY);
    if (!refreshData?.refreshToken) {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      redirect("/login");
      notification.error({
        message: "Session Expired!",
        description: "No refresh token available. Please log in again.",
      });
      return;
    }

    try {
      const refreshResponse = await refreshToken(refreshData.refreshToken);
      queryClient.setQueryData(AUTH_QUERY_KEY, (oldData: AuthResponse) => ({
        ...oldData,
        accessToken: refreshResponse.accessToken,
      }));

      config.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
      response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
        config
      );
    } catch {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      throw new Error("Session expired. Please log in again.");
    }
  }

  /**Other Errors */
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

export default apiClient;
