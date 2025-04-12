import { Button, Dropdown, MenuProps } from "antd";
import { EyeOutlined, MoreOutlined } from "@ant-design/icons";

interface ActionDropdownProps {
  onDetail?: () => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ onDetail }) => {
  const menuItems: MenuProps["items"] = [
    {
      key: "detail",
      label: "Chi tiết",
      icon: <EyeOutlined />,
      onClick: onDetail,
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
