import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import InventoryCheckListPage from "./list";

const InventoryCheckPage = () => {
  const location = useLocation();
  if (location.pathname === "/reports-stocks-gap")
    return <InventoryCheckListPage />;

  return <Outlet />;
};

export default InventoryCheckPage;
