import React from "react";
import ProviderListPage from "./list";
import { Outlet, useLocation } from "react-router-dom";

const ProviderPage = () => {
  const location = useLocation();
  if (location.pathname === "/providers") return <ProviderListPage />;

  return <Outlet />;
};

export default ProviderPage;
