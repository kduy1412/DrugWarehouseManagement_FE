import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import LotListPage from "./list";

const LotPage = () => {
  const location = useLocation();
  if (location.pathname === "/lots") return <LotListPage />;

  return <Outlet />;
};

export default LotPage;
