import { Button, Dropdown, MenuProps } from "antd";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../../hooks/useAuth";
import { Roles } from "../../../../types/enums/roles";

// Types
interface ActionDropdownProps {
  onDetail?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
  isDisablePreview?: boolean;
  isDisableEdit?: boolean;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  onDetail,
  onEdit,
  onPreview,
  isDisableEdit = true,
}) => {
  const { role } = useAuth();
  const allowedRoles = [Roles.InventoryManager, Roles.SaleAdmin];
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
      key: "pdf",
      label: "Xem",
      icon: <FilePdfOutlined />,
      onClick: onPreview,
    },
  ].filter((item) => item.onClick);

  const isAllowedEdit = isDisableEdit && allowedRoles.includes(role!);

  const filteredItem = isAllowedEdit
    ? menuItems.filter((item) => item?.key !== "edit")
    : menuItems;

  return (
    <Dropdown menu={{ items: filteredItem }} trigger={["click"]}>
      <Button type="text" icon={<MoreOutlined />} />
    </Dropdown>
  );
};

export default ActionDropdown;
