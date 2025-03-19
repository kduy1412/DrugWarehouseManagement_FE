import { Roles } from "./enums/roles";

export interface Credentials {
  userName: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  role: Roles;
  user: StoredUser;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  role: string;
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
  accountSettings: null;
}

export type StoredUser = Pick<User, "email" | "userName" | "fullName">;
