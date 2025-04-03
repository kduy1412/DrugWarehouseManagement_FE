import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import InboundRequestList from "./list inbound request";


const InboundPage = () => {
  const location = useLocation();
  if (location.pathname === "/inbound") {
    return <InboundRequestList />;
  }
  return <Outlet />;
};

export default InboundPage;
