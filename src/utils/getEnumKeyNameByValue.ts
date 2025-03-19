/* eslint-disable @typescript-eslint/no-explicit-any */
export function getEnumKeyNameByValue<T>(
  enumObj: T,
  value: any
): string | undefined {
  const keys = Object.keys(enumObj as any);
  return keys.find(
    (key) => (enumObj as any)[key] === value && isNaN(Number(key))
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */
