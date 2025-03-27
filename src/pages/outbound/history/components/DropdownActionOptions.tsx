import { Button, Dropdown, MenuProps } from "antd";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

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

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
      <Button type="text" icon={<MoreOutlined />} />
    </Dropdown>
  );
};

export default ActionDropdown;
