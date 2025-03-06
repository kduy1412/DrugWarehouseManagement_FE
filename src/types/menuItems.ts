import { Roles } from "./enums/roles";
import React from "react";

export type MenuItem = {
  key: string;
  icon?: React.ReactElement;
  label: string;
  url: string;
  allowedRoles: Roles[];
  children?: MenuItem[];
  element?: React.ReactNode | null;
};
