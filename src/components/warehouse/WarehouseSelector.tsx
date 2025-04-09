import { useDebounce } from "@uidotdev/usehooks";
import { RefSelectProps, Select, Spin, Table, TableProps, Empty } from "antd";
import { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { WarehouseGetView } from "../../types/warehouse";

interface WarehouseSelectorProps {
  value: number | null | undefined;
  onSelectedWarehouseChange: (warehouseId: number | null) => void;
  onSearchValueChange: (value: string) => void;
  warehouses: WarehouseGetView[] | undefined;
  loading?: boolean;
  placeholder?: string;
}

const WarehouseSelector = ({
  value,
  onSelectedWarehouseChange,
  onSearchValueChange,
  warehouses,
  loading = false,
  placeholder = "Chọn vị trí kho",
}: WarehouseSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectRef = useRef<RefSelectProps>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    onSearchValueChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchValueChange]);

  const handleRowClick = (record: WarehouseGetView) => {
    onSelectedWarehouseChange(record.warehouseId);
    setDropdownOpen(false);
    setSearchTerm("");
    selectRef.current?.blur();
  };

  const columns: TableProps<WarehouseGetView>["columns"] = [
    {
      title: "Mã Kho",
      dataIndex: "warehouseId",
      key: "warehouseId",
    },
    {
      title: "Tên Kho",
      dataIndex: "warehouseName",
      key: "warehouseName",
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
    },
  ];

  const selectedWarehouse = warehouses?.find((w) => w.warehouseId === value);

  return (
    <StyledSelect
      ref={selectRef}
      placeholder={placeholder}
      showSearch
      allowClear
      value={value}
      onSearch={setSearchTerm}
      onFocus={() => setDropdownOpen(true)}
      onClear={() => onSelectedWarehouseChange(null)}
      onBlur={() => !isHovered && setDropdownOpen(false)}
      open={dropdownOpen}
      dropdownRender={() => {
        if (loading) {
          return (
            <SpinWrapper>
              <Spin />
            </SpinWrapper>
          );
        }
        if (warehouses && warehouses.length > 0) {
          return (
            <Table
              columns={columns}
              dataSource={warehouses}
              rowKey="warehouseId"
              pagination={false}
              size="small"
              rowClassName="rowTableClassName"
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                onMouseEnter: () => setIsHovered(true),
                onMouseLeave: () => setIsHovered(false),
              })}
            />
          );
        }
        return (
          <EmptyWrapper>
            <Empty description="Không tìm thấy kho" />
          </EmptyWrapper>
        );
      }}
      optionLabelProp="label"
      dropdownStyle={{ minWidth: "400px" }}
    >
      {selectedWarehouse && (
        <Select.Option
          key={selectedWarehouse.warehouseId}
          value={selectedWarehouse.warehouseId}
          label={`${selectedWarehouse.warehouseName}`}
        >
          {selectedWarehouse.warehouseName}
        </Select.Option>
      )}
    </StyledSelect>
  );
};

const StyledSelect = styled(Select)`
  .ant-select-selector {
    height: 2rem !important;
    width: 100%;
    display: flex;
    align-items: center;
  }
  .ant-select-dropdown {
    padding: 0 !important;
  }
`;

const SpinWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const EmptyWrapper = styled.div`
  padding: 16px;
  text-align: center;
`;

export default WarehouseSelector;
