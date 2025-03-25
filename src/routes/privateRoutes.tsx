import { MenuRoutes } from "../types/menuRoutes";
import { Roles } from "../types/enums/roles";
import React from "react";
import OutboundPage from "../pages/outbound";
import LotPage from "../pages/lot";
import ReportPage from "../pages/reports";
import UserPage from "../pages/user";
import CustomerPage from "../pages/customer";
import SupplierPage from "../pages/supplier";
import ProductsPage from "../pages/product";
import WarehousePage from "../pages/warehouse";
import HomePage from "../pages/HomePage";
import InboundRequestListPage from "../pages/inbounds/request-list";
import CreateInboundRequest from "../pages/inbounds/create-inbound";
import ApproveRequest from "../pages/inbounds/approve-inbound";
import images from "../assets";
import OutBoundHistory from "../pages/outbound/history";
import CreateOutboundPage from "../pages/outbound/create";

export const privateRoutes: MenuRoutes[] = [
  {
    key: `/home`,
    icon: React.createElement(images.home),
    label: `Trang Chủ`,
    url: `/home`,
    allowedroles: [
      Roles.Admin,
      Roles.Accountant,
      Roles.Director,
      Roles.InventoryManager,
      Roles.SaleAdmin,
    ],
    element: <HomePage />,
  },
  {
    key: `/inbound`,
    icon: React.createElement(images.inbound),
    label: `Nhập Hàng`,
    url: `/inbound`,
    element: <InboundRequestListPage />,
    children: [
      {
        key: `/inbound/create`,

        label: `Tạo Yêu Cầu Nhập Hàng`,
        url: `/inbound/create`,
        element: <CreateInboundRequest />,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
      },
      {
        key: `/inbound/approve`,

        label: `Danh sach yêu cầu duyệt`,
        url: `/inbound/approve`,
        element: <ApproveRequest />,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
      },
      {
        key: `/inbound/add-to-warehouse`,
        label: `Thêm vào kho`,
        url: `/inbound/add-to-warehouse`,
        element: <ApproveRequest />,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
      },
    ],
    allowedroles: [
      Roles.Admin,
      Roles.Accountant,
      Roles.Director,
      Roles.InventoryManager,
      Roles.SaleAdmin,
    ],
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
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
        element: <CreateOutboundPage />,
      },
      {
        key: `/outbound/sample-export`,
        label: `Xuất Hàng Mẫu`,
        url: `/outbound/sample-export`,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
        element: <OutboundPage />,
      },
      {
        key: `/outbound/transfer`,
        label: "Chuyển Kho",
        url: "/outbound/transfer",
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
        element: <OutboundPage />,
      },
      {
        key: `/outbound/history`,
        label: "Lịch Sử Xuất Kho",
        url: "/outbound/history",
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
        element: <OutBoundHistory />,
      },
      {
        key: `/outbound/return`,
        label: `Trả Hàng Xuất`,
        url: "/outbound/return",
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
        element: <OutboundPage />,
      },
    ],
    allowedroles: [
      Roles.Admin,
      Roles.Accountant,
      Roles.Director,
      Roles.InventoryManager,
      Roles.SaleAdmin,
    ],
  },
  {
    key: `/lots`,
    icon: React.createElement(images.stock),
    label: `Hàng Tồn Kho`,
    url: `/lots`,
    allowedroles: [
      Roles.Admin,
      Roles.Accountant,
      Roles.Director,
      Roles.InventoryManager,
      Roles.SaleAdmin,
    ],
    element: <LotPage />,
  },
  {
    key: `/reports`,
    icon: React.createElement(images.report),
    label: `Báo Cáo Thống Kê`,
    url: `/reports`,
    allowedroles: [
      Roles.Admin,
      Roles.Accountant,
      Roles.Director,
      Roles.InventoryManager,
      Roles.SaleAdmin,
    ],
    element: <ReportPage />,
  },
  {
    key: `/account-management`,
    icon: React.createElement(images.accountManage),
    label: `Quản Lý Tài Khoản`,
    url: `/account-management`,
    allowedroles: [
      Roles.Admin,
      Roles.Accountant,
      Roles.Director,
      Roles.InventoryManager,
      Roles.SaleAdmin,
    ],
    element: <UserPage />,
  },
  {
    key: `/customers`,
    icon: React.createElement(images.customer),
    label: `Khách Hàng`,
    url: `/customers`,
    allowedroles: [
      Roles.Admin,
      Roles.Accountant,
      Roles.Director,
      Roles.InventoryManager,
      Roles.SaleAdmin,
    ],
    element: <CustomerPage />,
  },
  {
    key: `/suppliers`,
    icon: React.createElement(images.shoppingCart),
    label: `Nhà Cung Cấp`,
    url: `/suppliers`,
    allowedroles: [
      Roles.Admin,
      Roles.Accountant,
      Roles.Director,
      Roles.InventoryManager,
      Roles.SaleAdmin,
    ],
    element: <SupplierPage />,
  },
  {
    key: `/products`,
    icon: React.createElement(images.pill),
    label: `Mặt Hàng`,
    url: `/products`,
    allowedroles: [
      Roles.Admin,
      Roles.Accountant,
      Roles.Director,
      Roles.InventoryManager,
      Roles.SaleAdmin,
    ],
    element: <ProductsPage />,
  },
  {
    key: `/warehouse-system`,
    icon: React.createElement(images.warehouse),
    label: `Hệ Thống Kho`,
    url: `/warehouse-system`,
    allowedroles: [
      Roles.Admin,
      Roles.Accountant,
      Roles.Director,
      Roles.InventoryManager,
      Roles.SaleAdmin,
    ],
    element: <WarehousePage />,
  },
];
