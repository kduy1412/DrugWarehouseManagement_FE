import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import CustomerListPage from "./list";

const CustomerPage = () => {
  const location = useLocation();
  if (location.pathname === "/customers") return <CustomerListPage />;

return <Outlet />;
};

export default CustomerPage;
