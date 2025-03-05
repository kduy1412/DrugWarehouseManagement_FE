import React from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import images from "../images/index.ts";
import { Roles } from "../config/role.ts";

const { Sider } = Layout;

const url = [
  {
    key: `/home`, // Use the URL as the key
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
  },
  {
    key: `/outbound`,
    icon: React.createElement(images.outbound),
    label: `Xuất Hàng`,
    url: `/outbound`,
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
    key: `/stock`,
    icon: React.createElement(images.stock),
    label: `Hàng Tồn Kho`,
    url: `/stock`,
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
  },
  {
    key: `/items`,
    icon: React.createElement(images.pill),
    label: `Mặt Hàng`,
    url: `/items`,
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
  },
];

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout>
      <Layout>
        <Sider
          width={250}
          style={{
            background: colorBgContainer,
            height: "100vh",
            overflow: "auto",
            position: "sticky",
            insetInlineStart: 0,
            top: 0,
            bottom: 0,
            scrollbarWidth: "thin",
            scrollbarGutter: "stable",
            display: "flex",
          }}
        >
          <div style={{ width: "70%", margin: "1rem auto" }}>
            {React.createElement(images.sidebarBanner)}
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={["/home"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            items={url}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Breadcrumb
            items={[
              {
                title: "Home",
              },
              {
                title: "List",
              },
              {
                title: "App",
              },
            ]}
            style={{
              margin: "16px 0",
            }}
          />
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  );
};
export default App;
