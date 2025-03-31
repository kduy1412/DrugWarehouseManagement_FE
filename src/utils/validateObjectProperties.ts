import { notification } from "antd";

export const validateObjectProperties = <T>(
  obj: T,
  errorMessage: Partial<Record<keyof T, string>>
): boolean => {
  const keys = Object.keys(errorMessage) as Array<keyof T>;
  let isSuccess = true;

  keys.forEach((key) => {
    const value = obj[key];
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    ) {
      notification.error({
        description: `Chưa điền thông tin`,
        message: errorMessage[key] as string,
      });
      isSuccess = false;
    }
  });
  return isSuccess;
};
