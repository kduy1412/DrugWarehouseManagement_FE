export enum Roles {
  Admin = 1,
  InventoryManager = 2,
  Accountant = 3,
  SaleAdmin = 4,
  Director = 5,
  Public = 6,
}

export type RolesAsString =
  | "Admin"
  | "Inventory Manager"
  | "Sale Admin"
  | "Director"
  | "Accountant";

export const RolesAsNum: Record<RolesAsString, number> = {
  Admin: 1,
  "Inventory Manager": 2,
  Accountant: 3,
  "Sale Admin": 4,
  Director: 5,
};
