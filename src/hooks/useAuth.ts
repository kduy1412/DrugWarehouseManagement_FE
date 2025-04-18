import { useQuery, useMutation } from "@tanstack/react-query";
import { login, refreshToken, whoAmI } from "../api/auth";
import {
  AuthResponse,
  Credentials,
  LoginResponse,
  StoredUser,
  User,
} from "../types/auth";
import { AUTH_QUERY_KEY } from "../types/constants";
import { queryClient } from "../lib/queryClient";
import { Roles } from "../types/enums/roles";
import useLocalStorage from "./useLocalStorage";
import { notification } from "antd";

export function useAuth() {
  const [authData, setAuthData] = useLocalStorage<AuthResponse | null>(
    "auth_data",
    null
  );

  /*Query hold auth state */
  const authQuery = useQuery<AuthResponse | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => authData,
    initialData: authData,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  /*Login mutation */
  const loginMutation = useMutation<AuthResponse, Error, Credentials>({
    mutationFn: async (credentials: Credentials) => {
      const authData: LoginResponse = await login(credentials);
      const userData: User = await whoAmI(authData.token);

      const storedUser: StoredUser = {
        email: userData.email,
        fullName: userData.fullName,
        userName: userData.userName,
      };

      const currentRole = authData.role
        .split(" ")
        .join("") as keyof typeof Roles;

      return {
        token: authData.token,
        refreshToken: authData.refreshToken,
        role: Roles[currentRole],
        user: storedUser,
      };
    },
    onSuccess: async (data: AuthResponse) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data);
      setAuthData(data);
      notification.success({
        message: "Đăng nhập thành công",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Đăng nhập thất bại",
        description: error.message,
      });
    },
  });

  const updateUserInformation = (data: StoredUser) => {
    const currentData = queryClient.getQueryData<AuthResponse>(AUTH_QUERY_KEY);
    if (!currentData?.user) {
      notification.error({
        message: "Không có thông tin người dùng",
      });
    }

    queryClient.setQueryData(AUTH_QUERY_KEY, (oldData: AuthResponse) => {
      const updatedData: AuthResponse = { ...oldData, user: data };
      setAuthData(updatedData);
      return updatedData;
    });
  };

  /*Refresh token mutation */
  const refreshMutation = useMutation({
    mutationFn: () => {
      const currentData =
        queryClient.getQueryData<AuthResponse>(AUTH_QUERY_KEY);
      if (!currentData?.refreshToken) {
        throw new Error("No refresh token available");
      }
      return refreshToken(currentData.refreshToken);
    },
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, (oldData: AuthResponse) => {
        const updatedData: AuthResponse = { ...oldData, token: data.token };
        setAuthData(updatedData);
        return updatedData;
      });
    },
    onError: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      setAuthData(null);
    },
  });

  /*Logout mutation */
  const logout = () => {
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    setAuthData(null);
  };

  return {
    user: authQuery.data?.user as StoredUser | null,
    accessToken: authQuery.data?.token ?? null,
    refreshToken: authQuery.data?.refreshToken ?? null,
    isAuthenticated: !!authQuery.data?.token,
    login: loginMutation.mutate,
    logout: logout,
    refresh: refreshMutation.mutate,
    role: authQuery.data?.role as Roles | null,
    isLoading: authQuery.isLoading || loginMutation.isPending,
    setUser: (data: StoredUser) => updateUserInformation(data),
  };
}
