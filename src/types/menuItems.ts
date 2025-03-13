import { Roles } from "./enums/roles";
import React from "react";

export type MenuItem = {
  key: string;
  icon?: React.ReactElement;
  label: string;
  url: string;
  allowedroles: Roles[];
  children?: MenuItem[];
  element?: React.ReactNode | null;
};
