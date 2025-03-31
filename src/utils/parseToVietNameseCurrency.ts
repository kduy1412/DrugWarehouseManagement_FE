export const parseToVietNameseCurrency = (price: number) =>
  price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
