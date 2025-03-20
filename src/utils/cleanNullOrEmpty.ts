// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cleanFilterParams = <T extends Record<string, any>>(
  obj: T
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== null && value !== "" && value !== undefined
    )
  ) as Partial<T>;
};
