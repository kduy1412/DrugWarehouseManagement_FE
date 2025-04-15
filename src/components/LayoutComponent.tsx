import {
  Avatar,
  Breadcrumb,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  Space,
  theme,
} from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getVietnameseTranslations } from "../utils/breadcumHelper";
import { privateRoutes } from "../routes/privateRoutes";
import { useAuth } from "../hooks/useAuth";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import logo from "../assets/shared/sidebarBanner.svg";
import { filterMenuByRole } from "../utils/menuUtils.js";
import { getEnumKeyNameByValue } from "../utils/getEnumKeyNameByValue";
import { Roles } from "../types/enums/roles";
import styled from "styled-components";

const { Sider } = Layout;
const vietnameseTranslations = getVietnameseTranslations(privateRoutes);
const generateBreadcrumbItems = (path: string) => {
  const pathSegments = path.split("/").filter((segment) => segment);
  const startsWithHome = pathSegments[0] === "home";

  const items = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
    return {
      title:
        vietnameseTranslations[segment.toLowerCase()] ||
        segment.charAt(0).toUpperCase() + segment.slice(1),
      href: url,
    };
  });

  return startsWithHome
    ? items
    : [{ title: vietnameseTranslations["home"], href: "/home" }, ...items];
};

const LayoutComponent = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout } = useAuth();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key, { replace: true, flushSync: true });
  };

  const items: MenuProps["items"] = [
    {
      label: <Link to="/profile">Profile</Link>,
      key: "profile",
      icon: <UserOutlined />,
    },
    {
      label: <Link to="/settings">Settings</Link>,
      key: "settings",
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      label: "Logout",
      key: "logout",
      icon: <LogoutOutlined />,
      onClick: logout,
    },
  ];

  const filteredMenu = filterMenuByRole(privateRoutes, role ?? null).filter(
    (item) => !item.allowedroles.includes(Roles.Public)
  );

  const breadcrumbItems = generateBreadcrumbItems(location.pathname);

  return (
    <Layout>
      <Layout>
        <StyledSider width={270} $colorBgContainer={colorBgContainer}>
          <ImageWrapper>
            <Image src={logo} alt="Sidebar Banner" />
          </ImageWrapper>

          <StyledMenu
            mode="inline"
            defaultSelectedKeys={[location.pathname ?? "/home"]}
            items={filteredMenu}
            onClick={handleMenuClick}
          />
        </StyledSider>
        <StyledLayout>
          <PageHeader>
            <StyledBreadcrumb items={breadcrumbItems} />
            {role && (
              <Dropdown
                menu={{ items }}
                trigger={["click"]}
                placement="bottomRight"
                overlayStyle={{
                  width: "fit-content",
                  minWidth: 0,
                }}
              >
                <StyledSpace>
                  <StyledAvatar size="large">{user?.fullName[0]}</StyledAvatar>
                  <UserContainer>
                    <UserInformation>{`${
                      user?.fullName
                    } (${getEnumKeyNameByValue(
                      Roles,
                      role
                    )})`}</UserInformation>
                  </UserContainer>
                  <DownOutlined />
                </StyledSpace>
              </Dropdown>
            )}
          </PageHeader>
          <Outlet />
        </StyledLayout>
      </Layout>
    </Layout>
  );
};
export default LayoutComponent;

const StyledSider = styled(Sider)<{ $colorBgContainer: string }>`
  width: 270px;
  background: ${(props) => props.$colorBgContainer};
  height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  height: 200px;
  width: 80%;
  margin: 0 auto;
  padding: 8px 0;
  flex-shrink: 0;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const StyledMenu = styled(Menu)`
  border-right: 0;
  overflow: auto;
  height: calc(100vh - 200px);
  inset-inline-start: 0;
  scrollbar-width: thin;
  scrollbar-gutter: "stable";
`;

const StyledLayout = styled(Layout)`
  padding: 0 1.5rem 1.5rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--line-width-light) 0;
`;

const StyledBreadcrumb = styled(Breadcrumb)`
  margin: 1rem 0;
`;

const StyledSpace = styled(Space)`
  cursor: pointer;

  &:hover {
    color: var(--color-secondary-600);
  }
`;

const StyledAvatar = styled(Avatar)`
  vertical-align: middle;
`;

const UserContainer = styled.div`
  margin-left: var(--line-width-thin);
`;

const UserInformation = styled.span`
  font-weight: var(--font-weight-medium);
`;
