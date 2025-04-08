import { Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { WarehouseGetRequestParams } from "../../../../types/warehouse";

interface FilterComponentProps {
  setQuery: React.Dispatch<React.SetStateAction<WarehouseGetRequestParams>>;
  initialQueryParams: WarehouseGetRequestParams;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  setQuery,
  initialQueryParams,
}) => {
  const [search, setSearch] = useState<string>("");

  const handleSearch = () => {
    setQuery((prev) => ({ ...prev, Search: search, Page: 1 }));
  };

  const handleReset = () => {
    setQuery(initialQueryParams);
    setSearch("");
  };

  return (
    <Space direction="horizontal" style={{ marginBottom: 16 }}>
      <Input
        placeholder="Tìm kiếm kho"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onPressEnter={handleSearch}
        style={{ width: 200 }}
      />
      <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
        Tìm kiếm
      </Button>
      <Button onClick={handleReset}>Đặt lại</Button>
    </Space>
  );
};

export default FilterComponent;