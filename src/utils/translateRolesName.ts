export const parseRoleName = (name: string) => {
  switch (name) {
    case "Admin":
      return "Admin";
    case "InventoryManager":
      return "Thủ kho";
    case "Accountant":
      return "Kế toán";
    case "SaleAdmin":
      return "Sale Admin";
    case "Director":
      return "Giám đốc";
    default:
      return "Không tìm thấy";
  }
};
