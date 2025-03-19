import { Roles } from "./enums/roles";
import React from "react";

export type MenuRoutes = {
  key: string;
  icon?: React.ReactElement;
  label: string;
  url: string;
  allowedroles: Roles[];
  children?: MenuRoutes[];
  element?: React.ReactNode | null;
};
