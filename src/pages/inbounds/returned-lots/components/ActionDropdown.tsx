import { Button, Dropdown, MenuProps } from "antd";
import { EyeOutlined, MoreOutlined, InboxOutlined } from "@ant-design/icons";

interface ActionDropdownProps {
  onDetail?: () => void;
  onReturned?: () => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  onDetail,
  onReturned,
}) => {
  const menuItems: MenuProps["items"] = [
    {
      key: "detail",
      label: "Chi tiết",
      icon: <EyeOutlined />,
      onClick: onDetail,
    },
    {
      key: "nhập lại",
      label: "Nhập lại vào kho",
      icon: <InboxOutlined />,
      onClick: onReturned,
    },
  ].filter((item) => item.onClick);

  return (
    <Dropdown
      menu={{
        items: menuItems,
      }}
      trigger={["click"]}
    >
      <Button type="text" icon={<MoreOutlined />} />
    </Dropdown>
  );
};

export default ActionDropdown;
