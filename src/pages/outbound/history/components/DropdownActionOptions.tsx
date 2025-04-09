import { Button, Dropdown, MenuProps } from "antd";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

// Types
interface ActionDropdownProps {
  onDetail?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
  isDisablePreview?: boolean;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  onDetail,
  onEdit,
  onDelete,
  onPreview,
  isDisablePreview = true,
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
      key: "pdf",
      label: "Xem",
      icon: <FilePdfOutlined />,
      onClick: onPreview,
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
    <Dropdown
      menu={{
        items: isDisablePreview ? menuItems : menuItems,
      }}
      trigger={["click"]}
    >
      <Button type="text" icon={<MoreOutlined />} />
    </Dropdown>
  );
};

export default ActionDropdown;
