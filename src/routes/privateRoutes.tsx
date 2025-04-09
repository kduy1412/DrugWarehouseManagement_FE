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
import UpdateInbound from "../pages/inbounds/update inbound order";
import CreateUserPage from "../pages/user/create";
import UserListPage from "../pages/user/list";
import WarehouseListPage from "../pages/warehouse/list";
import CreateWarehousePage from "../pages/warehouse/create";
import CategoryPage from "../pages/category";
import { TagsOutlined } from "@ant-design/icons";

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

        label: `Tạo phiếu đặt hàng`,
        url: `/inbound/create-inbound-request`,
        element: <CreateInboundRequest />,
        allowedroles: [Roles.SaleAdmin],
      },
      {
        key: `/inbound/history-inbound-request`,

        label: `Danh sách phiếu đặt hàng `,
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
        label: `Đơn chờ duyệt`,
        url: `/inbound/approval-inbound-request-by-accountant`,
        element: <ApprovalInboundRequestList />,
        allowedroles: [Roles.Accountant],
      },
      {
        key: `/inbound/approval-inbound-request-by-ceo`,
        label: `Đơn chờ duyệt`,
        url: `/inbound/approval-inbound-request-by-ceo`,
        element: <ApprovalInboundRequestListByCEO />,
        allowedroles: [Roles.Director],
      },
      {
        key: `/inbound/create-inbound`,
        label: `Tạo đơn nhập hàng`,
        url: `/inbound/create-inbound`,
        element: <CreateInboundOrderList />,
        allowedroles: [Roles.Accountant],
      },
      {
        key: `/inbound/history-inbound-order`,
        label: `Danh sách đơn nhập hàng`,
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
        label: `Tạo báo cáo nhập`,
        url: `/inbound/create-inbound-report`,
        element: <CreateInboundReport />,
        allowedroles: [Roles.InventoryManager],
      },
      {
        key: `/inbound/history-inbound-report`,
        label: `Danh sách báo cáo nhập`,
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
      {
        key: `/inbound/update-inbound`,
        label: `Cập nhật đơn hàng`,
        url: `/inbound/update-inbound`,
        element: <UpdateInbound />,
        allowedroles: [Roles.Accountant],
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
        allowedroles: [Roles.InventoryManager, Roles.SaleAdmin],
        element: <CreateOutboundPage />,
      },
      {
        key: `/outbound/sample-export`,
        label: `Xuất Hàng Mẫu`,
        url: `/outbound/sample-export`,
        allowedroles: [Roles.InventoryManager, Roles.SaleAdmin],
        element: <SampleExportPage />,
      },
      {
        key: `/outbound/transfer`,
        label: "Chuyển Kho",
        url: "/outbound/transfer",
        allowedroles: [Roles.InventoryManager, Roles.SaleAdmin],
        element: <TransferLotPage />,
      },
      {
        key: `/outbound/history`,
        label: "Lịch Sử Xuất Kho",
        url: "/outbound/history",
        allowedroles: [Roles.InventoryManager, Roles.SaleAdmin],
        element: <OutBoundHistory />,
      },
      {
        key: `/outbound/return`,
        label: `Trả Hàng Xuất`,
        url: "/outbound/return",
        allowedroles: [Roles.InventoryManager, Roles.SaleAdmin],
        element: <ReturnOutboundPage />,
      },
    ],
    allowedroles: [Roles.InventoryManager, Roles.SaleAdmin],
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
    icon: React.createElement(images.accountManage),
    allowedroles: [Roles.Admin],
    element: <UserPage />,
    children: [
      {
        key: `/account-management/create`,
        label: `Tạo tài khoản mới`,
        url: `/account-management/create`,
        allowedroles: [Roles.Admin],
        element: <CreateUserPage />,
      },
      {
        key: `/account-management/list`,
        label: `Danh sách tài khoản`,
        url: `/account-management/list`,
        allowedroles: [Roles.Admin],
        element: <UserListPage />,
      },
    ],
  },
  {
    key: `/customers`,
    icon: React.createElement(images.customer),
    label: `Khách Hàng`,
    url: `/customers`,
    allowedroles: [Roles.Admin],
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
    children: [
      {
        key: `/warehouse-system/list`,
        label: `Danh Sách Kho`,
        url: `/warehouse-system/list`,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
        element: <WarehouseListPage />,
      },
      {
        key: `/warehouse-system/create`,
        label: `Tạo mới kho`,
        url: `/warehouse-system/create`,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
        element: <CreateWarehousePage />,
      },
    ],
  },
  {
    key: `/category`,
    label: `Quản Lý Danh Mục`,
    url: `/category`,
    icon: <TagsOutlined />,
    allowedroles: [Roles.Admin],
    element: <CategoryPage />,
  },
];
