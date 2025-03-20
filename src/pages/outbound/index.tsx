import React from "react";
import OutBoundHistory from "./history";
import { Outlet, useLocation } from "react-router-dom";

const OutboundPage = () => {
  const location = useLocation();
  if (location.pathname === "/") {
    return <OutBoundHistory />;
  }
  return <Outlet />;
};

export default OutboundPage;
