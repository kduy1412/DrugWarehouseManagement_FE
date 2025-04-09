import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import UserListPage from "./list";

const UserPage = () => {
  const location = useLocation();
  if (location.pathname === "/account-management") return <UserListPage />;

  return <Outlet />;
};

export default UserPage;
