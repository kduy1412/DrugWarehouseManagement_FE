import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import WarehouseListPage from "./list";

const WarehousePage = () => {
  const location = useLocation();
  if (location.pathname === "/warehouse-system") return <WarehouseListPage />;

  return <Outlet />;
};

export default WarehousePage;
