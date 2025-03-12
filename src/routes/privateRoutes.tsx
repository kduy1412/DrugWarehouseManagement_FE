import { MenuItem } from "../types/menuItems";
import { Roles } from "../types/enums/roles";

import React from "react";

import InboundPage from "../pages/inbounds";
import OutboundPage from "../pages/outbound";
import LotPage from "../pages/lot";
import ReportPage from "../pages/reports";
import UserPage from "../pages/user";
import CustomerPage from "../pages/customer";
import SupplierPage from "../pages/supplier";
import ProductsPage from "../pages/product";
import WarehousePage from "../pages/warehouse";
import HomePage from "../pages/HomePage";
import images from "../images";

export const privateRoutes: MenuItem[] = [
  {
    key: `/home`,
    icon: React.createElement(images.home),
    label: `Trang Chủ`,
    url: `/home`,
    allowedRoles: [
      Roles.ADMIN,
      Roles.ACCOUNTANT,
      Roles.CEO,
      Roles.INVENTORYMANAGER,
      Roles.SALEADMIN,
      Roles.USER,
    ],
    element: <HomePage />,
  },
  {
    key: `/inbound`,
    icon: React.createElement(images.inbound),
    label: `Nhập Hàng`,
    url: `/inbound`,
    allowedRoles: [
      Roles.ADMIN,
      Roles.ACCOUNTANT,
      Roles.CEO,
      Roles.INVENTORYMANAGER,
      Roles.SALEADMIN,
      Roles.USER,
    ],
    element: <InboundPage />,
  },
  {
    key: `/outbound`,
    icon: React.createElement(images.outbound),
    label: `Xuất Hàng`,
    url: `/outbound`,
    element: <OutboundPage />,
    children: [
      {
        key: `/outbound/create`,
        label: `Tạo Đơn`,
        url: `/outbound/create`,
        allowedRoles: [
          Roles.ADMIN,
          Roles.ACCOUNTANT,
          Roles.CEO,
          Roles.INVENTORYMANAGER,
          Roles.SALEADMIN,
          Roles.USER,
        ],
        element: <OutboundPage />,
      },
      {
        key: `/outbound/sample-export`,
        label: `Xuất Hàng Mẫu`,
        url: `/outbound/sample-export`,
        allowedRoles: [
          Roles.ADMIN,
          Roles.ACCOUNTANT,
          Roles.CEO,
          Roles.INVENTORYMANAGER,
          Roles.SALEADMIN,
          Roles.USER,
        ],
        element: <OutboundPage />,
      },
      {
        key: `/outbound/transfer`,
        label: "Chuyển Kho",
        url: "/outbound/transfer",
        allowedRoles: [
          Roles.ADMIN,
          Roles.ACCOUNTANT,
          Roles.CEO,
          Roles.INVENTORYMANAGER,
          Roles.SALEADMIN,
          Roles.USER,
        ],
        element: <OutboundPage />,
      },
      {
        key: `/outbound/history`,
        label: "Lịch Sử Xuất Kho",
        url: "/outbound/history",
        allowedRoles: [
          Roles.ADMIN,
          Roles.ACCOUNTANT,
          Roles.CEO,
          Roles.INVENTORYMANAGER,
          Roles.SALEADMIN,
          Roles.USER,
        ],
        element: <OutboundPage />,
      },
      {
        key: `/outbound/return`,
        label: `Trả Hàng Xuất`,
        url: "/outbound/return",
        allowedRoles: [
          Roles.ADMIN,
          Roles.ACCOUNTANT,
          Roles.CEO,
          Roles.INVENTORYMANAGER,
          Roles.SALEADMIN,
          Roles.USER,
        ],
        element: <OutboundPage />,
      },
    ],
    allowedRoles: [
      Roles.ADMIN,
      Roles.ACCOUNTANT,
      Roles.CEO,
      Roles.INVENTORYMANAGER,
      Roles.SALEADMIN,
      Roles.USER,
    ],
  },
  {
    key: `/lots`,
    icon: React.createElement(images.stock),
    label: `Hàng Tồn Kho`,
    url: `/lots`,
    allowedRoles: [
      Roles.ADMIN,
      Roles.ACCOUNTANT,
      Roles.CEO,
      Roles.INVENTORYMANAGER,
      Roles.SALEADMIN,
      Roles.USER,
    ],
    element: <LotPage />,
  },
  {
    key: `/reports`,
    icon: React.createElement(images.report),
    label: `Báo Cáo Thống Kê`,
    url: `/reports`,
    allowedRoles: [
      Roles.ADMIN,
      Roles.ACCOUNTANT,
      Roles.CEO,
      Roles.INVENTORYMANAGER,
      Roles.SALEADMIN,
      Roles.USER,
    ],
    element: <ReportPage />,
  },
  {
    key: `/account-management`,
    icon: React.createElement(images.accountManage),
    label: `Quản Lý Tài Khoản`,
    url: `/account-management`,
    allowedRoles: [
      Roles.ADMIN,
      Roles.ACCOUNTANT,
      Roles.CEO,
      Roles.INVENTORYMANAGER,
      Roles.SALEADMIN,
      Roles.USER,
    ],
    element: <UserPage />,
  },
  {
    key: `/customers`,
    icon: React.createElement(images.customer),
    label: `Khách Hàng`,
    url: `/customers`,
    allowedRoles: [
      Roles.ADMIN,
      Roles.ACCOUNTANT,
      Roles.CEO,
      Roles.INVENTORYMANAGER,
      Roles.SALEADMIN,
      Roles.USER,
    ],
    element: <CustomerPage />,
  },
  {
    key: `/suppliers`,
    icon: React.createElement(images.shoppingCart),
    label: `Nhà Cung Cấp`,
    url: `/suppliers`,
    allowedRoles: [
      Roles.ADMIN,
      Roles.ACCOUNTANT,
      Roles.CEO,
      Roles.INVENTORYMANAGER,
      Roles.SALEADMIN,
      Roles.USER,
    ],
    element: <SupplierPage />,
  },
  {
    key: `/products`,
    icon: React.createElement(images.pill),
    label: `Mặt Hàng`,
    url: `/products`,
    allowedRoles: [
      Roles.ADMIN,
      Roles.ACCOUNTANT,
      Roles.CEO,
      Roles.INVENTORYMANAGER,
      Roles.SALEADMIN,
      Roles.USER,
    ],
    element: <ProductsPage />,
  },
  {
    key: `/warehouse-system`,
    icon: React.createElement(images.warehouse),
    label: `Hệ Thống Kho`,
    url: `/warehouse-system`,
    allowedRoles: [
      Roles.ADMIN,
      Roles.ACCOUNTANT,
      Roles.CEO,
      Roles.INVENTORYMANAGER,
      Roles.SALEADMIN,
      Roles.USER,
    ],
    element: <WarehousePage />,
  },
];
