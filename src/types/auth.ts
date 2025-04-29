import { Roles } from "./enums/roles";

export interface Credentials {
  userName: string;
  password: string;
  otpCode?: string;
  backupCode?: string;
  lostOTPCode?: boolean;
  onRequiresTwoFactorCallback?: (userName: string, password: string) => void;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  role: Roles;
  user: StoredUser;
  requiresTwoFactor: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  role: string;
  requiresTwoFactor?: boolean | null;
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

export interface Setup2FAPostResponse {
  imageUrlQrCode: string;
  manualEntryKey: string;
  backupCode?: string | null;
}

export interface ConfirmSetup2FAPostRequest {
  otpCode: string;
}

export interface ConfirmSetup2FAPostResponse {
  code: number;
  message: string;
  details: null;
  result: Result;
}

export interface Result {
  backupCode: string;
}

export type StoredUser = Pick<User, "email" | "userName" | "fullName">;
