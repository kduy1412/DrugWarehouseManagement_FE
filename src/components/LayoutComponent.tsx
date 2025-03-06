import React from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import images from "../images";
import { filteredMenu } from "../routes/index.js";

const { Sider } = Layout;

const LayoutComponent = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const handleMenuClick = ({ key }: { key: string }) => {
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
            items={filteredMenu}
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
export default LayoutComponent;
