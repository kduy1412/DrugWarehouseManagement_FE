import { redirect } from "react-router-dom";
import { queryClient } from "../lib/queryClient";
import { AuthResponse } from "../types/auth";
import { AUTH_QUERY_KEY } from "../types/constants";
import { refreshToken } from "./auth";
import { notification } from "antd";

const apiClient = async (
  endpoint: string,
  options: RequestInit = {},
  isBlob = false
) => {
  const authData = queryClient.getQueryData<AuthResponse>(AUTH_QUERY_KEY);
  const accessToken = authData?.token;

  const isFormData = options.body instanceof FormData;
  const defaultHeaders = {
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
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
      localStorage.removeItem("auth_data");
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
        token: refreshResponse.token,
      }));

      localStorage.removeItem("auth_data");
      localStorage.setItem(
        "auth_data",
        JSON.stringify({
          token: refreshResponse.token,
          refreshToken: refreshData.refreshToken,
          role: refreshData.role,
          user: refreshData.user,
        } as AuthResponse)
      );

      config.headers.Authorization = `Bearer ${refreshResponse.token}`;
      response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
        config
      );
    } catch {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      localStorage.removeItem("auth_data");
      redirect("/login");
      throw new Error("Session expired. Please log in again.");
    }
  }

  /**Access forbidden */
  if (response.status === 403) {
    throw new Error("Không có quyền thực hiện!");
  }

  /**Two Account */
  if (response.status === 409) {
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    localStorage.removeItem("auth_data");
    redirect("/login");
    throw new Error("Session expired. Please log in again.");
  }

  /**Other Errors */
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  if (isBlob) {
    return response.blob();
  }

  return response.json();
};

export default apiClient;
