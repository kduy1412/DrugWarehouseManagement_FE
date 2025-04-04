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
import CreateInboundRequest from "../pages/inbounds/create inbound request";
import images from "../assets";
import OutBoundHistory from "../pages/outbound/history";
import CreateOutboundPage from "../pages/outbound/create";
import InboundPage from "../pages/inbounds";
import InboundRequestList from "../pages/inbounds/list inbound request";
import ApprovalInboundRequestList from "../pages/inbounds/approval by accountant";
import ApprovalInboundRequestListByCEO from "../pages/inbounds/approval by ceo";
import CreateInboundOrderList from "../pages/inbounds/create inbound order";
import HistoryInboundOrder from "../pages/inbounds/list inbound order";
import SampleExportPage from "../pages/outbound/sample-export";
import TransferLotPage from "../pages/outbound/transfer";
import ReturnOutboundPage from "../pages/outbound/return";
import CustomerListPage from "../pages/customer/list";
import CreateCustomerPage from "../pages/customer/create";
import CreateInboundReport from "../pages/inbounds/create inbound report";
import HistoryInboundReport from "../pages/inbounds/list inbound report";

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
    element: <InboundPage />,
    children: [
      {
        key: `/inbound/create-inbound-request`,

        label: `Create Inbound Request`,
        url: `/inbound/create-inbound-request`,
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
        key: `/inbound/history-inbound-request`,

        label: `History Inbound Request`,
        url: `/inbound/history-inbound-request`,
        element: <InboundRequestList />,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
      },
      {
        key: `/inbound/approval-inbound-request-by-accountant`,
        label: `Approval By Accountant`,
        url: `/inbound/approval-inbound-request-by-accountant`,
        element: <ApprovalInboundRequestList />,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
      },
      {
        key: `/inbound/approval-inbound-request-by-ceo`,
        label: `Approval By CEO`,
        url: `/inbound/approval-inbound-request-by-ceo`,
        element: <ApprovalInboundRequestListByCEO />,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
      },
      {
        key: `/inbound/create-inbound`,
        label: `Create Inbound Order`,
        url: `/inbound/create-inbound`,
        element: <CreateInboundOrderList />,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
      },
      {
        key: `/inbound/history-inbound-order`,
        label: `History Inbound Order`,
        url: `/inbound/history-inbound-order`,
        element: <HistoryInboundOrder />,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
      },
      {
        key: `/inbound/create-inbound-report`,
        label: `Create Inbound Report`,
        url: `/inbound/create-inbound-report`,
        element: <CreateInboundReport />,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
      },
      {
        key: `/inbound/history-inbound-report`,
        label: `History Inbound Report`,
        url: `/inbound/history-inbound-report`,
        element: <HistoryInboundReport />,
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
        element: <SampleExportPage />,
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
        element: <TransferLotPage />,
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
        element: <ReturnOutboundPage />,
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
    children: [
      {
        key: `/customers/list`,
        label: `Danh Sách Khách Hàng`,
        url: `/customers/list`,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
        element: <CustomerListPage />,
      },
      {
        key: `/customers/create`,
        label: `Thêm Khách Hàng Mới`,
        url: `/customers/create`,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
        element: <CreateCustomerPage />,
      },
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
