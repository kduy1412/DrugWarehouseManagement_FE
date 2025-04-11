import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import ProductListPage from "./list";

const ProductsPage = () => {
  const location = useLocation();
  if (location.pathname === "/products") return <ProductListPage />;

  return <Outlet />;
};

export default ProductsPage;
