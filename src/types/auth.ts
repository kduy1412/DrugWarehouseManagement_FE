export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  roleId?: number | null;
  roleName?: string | null;
  status: string;
  twoFactorEnabled: boolean;
  phoneNumberConfirmed: boolean;
  emailConfirmed: boolean;
}
