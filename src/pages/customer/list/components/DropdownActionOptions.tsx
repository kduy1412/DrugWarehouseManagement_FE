import { Button, Dropdown, MenuProps } from "antd";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../../hooks/useAuth";
import { Roles } from "../../../../types/enums/roles";

// Types
interface ActionDropdownProps {
  onDetail?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  onDetail,
  onEdit,
  onDelete,
}) => {
  const { role } = useAuth();
  const allowedRoles = [Roles.SaleAdmin];
  const menuItems: MenuProps["items"] = [
    {
      key: "detail",
      label: "Chi tiết",
      icon: <EyeOutlined />,
      onClick: onDetail,
    },
    {
      key: "edit",
      label: "Chỉnh Sửa",
      icon: <EditOutlined />,
      onClick: onEdit,
    },
    {
      key: "delete",
      label: "Xóa",
      icon: <DeleteOutlined />,
      onClick: onDelete,
      danger: true,
    },
  ].filter((item) => item.onClick);

  const filteredMenu = allowedRoles.includes(role as Roles)
    ? menuItems
    : menuItems.filter(
        (item) => item?.key !== "edit" && item?.key !== "delete"
      );

  return (
    <Dropdown menu={{ items: filteredMenu }} trigger={["click"]}>
      <Button type="text" icon={<MoreOutlined />} />
    </Dropdown>
  );
};

export default ActionDropdown;
