import { MenuRoutes } from "../types/menuRoutes";
import { Roles } from "../types/enums/roles";
import React from "react";
import OutboundPage from "../pages/outbound";
import LotPage from "../pages/lot";
import ReportPage from "../pages/reports";
import UserPage from "../pages/user";
import CustomerPage from "../pages/customer";
import ProviderPage from "../pages/provider";
import ProductsPage from "../pages/product";
import WarehousePage from "../pages/warehouse";
import HomePage from "../pages/HomePage";
import CreateInboundRequest from "../pages/inbounds/create-inbound-request";
import images from "../assets";
import OutBoundHistory from "../pages/outbound/history";
import CreateOutboundPage from "../pages/outbound/create";
import InboundPage from "../pages/inbounds";
import ApprovalInboundRequestList from "../pages/inbounds/approval-by-accountant";
import ApprovalInboundRequestListByCEO from "../pages/inbounds/approval-by-ceo";
import CreateInboundOrderList from "../pages/inbounds/create-inbound-order";
import SampleExportPage from "../pages/outbound/sample-export";
import TransferLotPage from "../pages/outbound/transfer";
import ReturnOutboundPage from "../pages/outbound/return";
import CustomerListPage from "../pages/customer/list";
import CreateCustomerPage from "../pages/customer/create";
import CreateInboundReport from "../pages/inbounds/create-inbound-report";
import CreateUserPage from "../pages/user/create";
import UserListPage from "../pages/user/list";
import WarehouseListPage from "../pages/warehouse/list";
import CreateWarehousePage from "../pages/warehouse/create";
import CategoryPage from "../pages/category";
import { TagsOutlined, SnippetsOutlined } from "@ant-design/icons";
import ProductListPage from "../pages/product/list";
import CreateProductPage from "../pages/product/create";
import ProviderListPage from "../pages/provider/list";
import CreateProviderPage from "../pages/provider/create";
import ProfilePage from "../pages/profile";
import ReturnedLotsPage from "../pages/inbounds/returned-lots";
import CreateInventoryCheckPage from "../pages/inventory-check/create";
import InventoryCheckPage from "../pages/inventory-check";
import InventoryCheckListPage from "../pages/inventory-check/list";
import InboundListPage from "../pages/inbounds/list";

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
        key: `/inbound/create-inbound-report`,
        label: `Tạo báo cáo nhập`,
        url: `/inbound/create-inbound-report`,
        element: <CreateInboundReport />,
        allowedroles: [Roles.InventoryManager],
      },
      {
        key: `/inbound/returned-lots`,
        label: `Chờ nhập kho (Hàng trả về)`,
        url: `/inbound/returned-lots`,
        element: <ReturnedLotsPage />,
        allowedroles: [Roles.InventoryManager],
      },
      {
        key: `/inbound/inbound-history`,
        label: `Lịch sử nhập hàng`,
        url: `/inbound/inbound-history`,
        element: <InboundListPage />,
        allowedroles: [
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
      },
    ],
    allowedroles: [
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
        key: `/outbound/create-outbound`,
        label: `Tạo Đơn`,
        url: `/outbound/create-outbound`,
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
    key: `/reports-stocks-gap`,
    icon: <SnippetsOutlined />,
    label: `Kiểm kê`,
    url: `/reports-stocks-gap`,
    allowedroles: [
      Roles.Admin,
      Roles.Accountant,
      Roles.Director,
      Roles.InventoryManager,
      Roles.SaleAdmin,
    ],
    children: [
      {
        key: `/reports-stocks-gap/create-stock-gap`,
        label: `Tạo báo cáo kiểm kê`,
        url: `/reports-stocks-gap/create-stock-gap`,
        allowedroles: [Roles.InventoryManager],
        element: <CreateInventoryCheckPage />,
      },
      {
        key: `/reports-stocks-gap/list-stock-gap`,
        label: `Danh sách báo cáo kiểm kê`,
        url: `/reports-stocks-gap/list-stock-gap`,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
        element: <InventoryCheckListPage />,
      },
    ],
    element: <InventoryCheckPage />,
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
        key: `/account-management/create-account`,
        label: `Tạo tài khoản mới`,
        url: `/account-management/create-account`,
        allowedroles: [Roles.Admin],
        element: <CreateUserPage />,
      },
      {
        key: `/account-management/list-account`,
        label: `Danh sách tài khoản`,
        url: `/account-management/list-account`,
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
    allowedroles: [Roles.SaleAdmin],
    children: [
      {
        key: `/customers/list-customer`,
        label: `Danh Sách Khách Hàng`,
        url: `/customers/list-customer`,
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
        key: `/customers/create-customer`,
        label: `Thêm Khách Hàng Mới`,
        url: `/customers/create-customer`,
        allowedroles: [Roles.SaleAdmin],
        element: <CreateCustomerPage />,
      },
    ],
    element: <CustomerPage />,
  },
  {
    key: `/providers`,
    icon: React.createElement(images.shoppingCart),
    label: `Nhà Cung Cấp`,
    url: `/providers`,
    allowedroles: [
      Roles.Admin,
      Roles.Accountant,
      Roles.Director,
      Roles.InventoryManager,
      Roles.SaleAdmin,
    ],
    element: <ProviderPage />,
    children: [
      {
        key: `/providers/provider-list`,
        label: `Danh sách nhà cung cấp`,
        url: `/providers/provider-list`,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
        element: <ProviderListPage />,
      },
      {
        key: `/providers/provider-create`,
        label: `Tạo mới nhà cung cấp`,
        url: `/providers/provider-create`,
        allowedroles: [Roles.SaleAdmin],
        element: <CreateProviderPage />,
      },
    ],
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
    children: [
      {
        key: `/products/list-product`,
        label: `Danh sách mặt hàng`,
        url: `/products/list-product`,
        allowedroles: [
          Roles.Admin,
          Roles.Accountant,
          Roles.Director,
          Roles.InventoryManager,
          Roles.SaleAdmin,
        ],
        element: <ProductListPage />,
      },
      {
        key: `/products/create-product`,
        label: `Tạo mặt hàng mới`,
        url: `/products/create-product`,
        allowedroles: [Roles.SaleAdmin],
        element: <CreateProductPage />,
      },
    ],
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
        key: `/warehouse-system/list-warehouse`,
        label: `Danh Sách Kho`,
        url: `/warehouse-system/list-warehouse`,
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
        key: `/warehouse-system/create-warehouse`,
        label: `Tạo mới kho`,
        url: `/warehouse-system/create-warehouse`,
        allowedroles: [Roles.SaleAdmin],
        element: <CreateWarehousePage />,
      },
    ],
  },
  {
    key: `/category`,
    label: `Quản Lý Danh Mục`,
    url: `/category`,
    icon: <TagsOutlined />,
    allowedroles: [Roles.Admin, Roles.SaleAdmin],
    element: <CategoryPage />,
  },
  {
    key: `/profile`,
    label: `Quản Lý Danh Mục`,
    url: `/profile`,
    allowedroles: [Roles.Public],
    element: <ProfilePage />,
  },
];
