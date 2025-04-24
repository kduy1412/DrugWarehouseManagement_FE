import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import InboundListPage from "./list";

const InboundPage = () => {
  const location = useLocation();
  if (location.pathname === "/inbound") {
    return <InboundListPage />;
  }
  return <Outlet />;
};

export default InboundPage;
