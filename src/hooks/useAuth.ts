import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { login, refreshToken, logout } from "../api/auth";
import { AuthResponse, Credentials, User } from "../types/auth";
import { AUTH_QUERY_KEY } from "../types/constants";

export function useAuth() {
  const queryClient = useQueryClient();

  /*Query hold auth state */
  const authQuery = useQuery<AuthResponse | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => queryClient.getQueryData(AUTH_QUERY_KEY) || null,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  /*Login mutation */
  const loginMutation = useMutation<AuthResponse, Error, Credentials>({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data);
    },
  });

  /*Refresh token mutation */
  const refreshMutation = useMutation({
    mutationFn: () => {
      const currentData = queryClient.getQueryData<{
        refreshToken: string | null;
      }>(AUTH_QUERY_KEY);
      if (!currentData?.refreshToken) {
        throw new Error("No refresh token available");
      }
      return refreshToken(currentData.refreshToken);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, (oldData: AuthResponse) => ({
        ...oldData,
        accessToken: data.accessToken,
      }));
    },
    onError: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    },
  });

  /*Logout mutation */
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    },
  });

  return {
    user: authQuery.data?.user as User | null,
    accessToken: authQuery.data?.accessToken || null,
    refreshToken: authQuery.data?.refreshToken || null,
    isAuthenticated: !!authQuery.data?.accessToken,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    refresh: refreshMutation.mutate,
    isLoading: authQuery.isLoading || loginMutation.isPending,
  };
}
