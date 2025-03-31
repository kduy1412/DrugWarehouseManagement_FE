import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import InboundRequestList from "../../components/inbound/InboundRequestList";

const InboundPage = () => {
  const location = useLocation();
  if (location.pathname === "/inbound") {
    return <InboundRequestList />;
  }
  return <Outlet />;
};

export default InboundPage;
