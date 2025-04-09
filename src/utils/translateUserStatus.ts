import { UserStatus, UserStatusAsNum } from "../types/user";

export const parseUserStatusToVietnamese = (
  status: UserStatus
): string => {
  const statusNumber = UserStatusAsNum[status];
  switch (statusNumber) {
    case UserStatusAsNum.Active:
      return "Hoạt Động";
    case UserStatusAsNum.Inactive:
      return "Bị Vô Hiệu";
    case UserStatusAsNum.Deleted:
      return "Đã Bị Xóa";
    default:
      return "Không xác định";
  }
};
