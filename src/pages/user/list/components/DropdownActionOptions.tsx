import { Button, Dropdown, MenuProps, Popconfirm } from "antd";
import {
  MoreOutlined,
  EyeOutlined,
  DeleteOutlined,
  LockOutlined,
} from "@ant-design/icons";

interface ActionDropdownProps {
  onDetail?: () => void;
  onDelete?: () => void;
  onResetPassword?: () => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  onDetail,
  onDelete,
  onResetPassword,
}) => {
  const menuItems: MenuProps["items"] = [
    {
      key: "detail",
      label: "Chi tiết",
      icon: <EyeOutlined />,
      onClick: onDetail,
    },
    {
      key: "reset-password",
      label: "Thiết lập lại mật khẩu",
      icon: <LockOutlined />,
      onClick: onResetPassword,
    },
    {
      key: "delete",
      label: "Xóa",
      icon: <DeleteOutlined />,
      onClick: onDelete,
      danger: true,
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
      <Button type="text" icon={<MoreOutlined />} />
    </Dropdown>
  );
};

export default ActionDropdown;
