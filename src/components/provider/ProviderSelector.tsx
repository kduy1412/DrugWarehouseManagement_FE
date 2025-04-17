import { useDebounce } from "@uidotdev/usehooks";
import { RefSelectProps, Select, Spin, Table, TableProps, Empty } from "antd";
import { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Provider } from "../../types/provider";

interface ProviderSelectorProps {
  value: number | null | undefined;
  onSelectedProviderChange: (provider: Provider | null) => void;
  onSearchValueChange: (value: string) => void;
  providers: Provider[] | undefined;
  loading?: boolean;
  placeholder?: string;
}

const ProviderSelector = ({
  value,
  onSelectedProviderChange,
  onSearchValueChange,
  providers,
  loading = false,
  placeholder = "Chọn nhà cung cấp",
}: ProviderSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectRef = useRef<RefSelectProps>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    onSearchValueChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchValueChange]);

  const handleRowClick = (record: Provider) => {
    onSelectedProviderChange(record);
    setDropdownOpen(false);
    setSearchTerm("");
    selectRef.current?.blur();
  };

  const columns: TableProps<Provider>["columns"] = [
    {
      title: "Tên nhà cung cấp",
      dataIndex: "providerName",
      key: "providerName",
    },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "Số điện thoại", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Email", dataIndex: "email", key: "email" },
  ];

  const selectedProvider = providers?.find((p) => p.providerId === value);

  return (
    <StyledSelect
      ref={selectRef}
      placeholder={placeholder}
      showSearch
      allowClear
      value={value}
      onSearch={setSearchTerm}
      onFocus={() => setDropdownOpen(true)}
      onClear={() => onSelectedProviderChange(null)}
      onBlur={() => !isHovered && setDropdownOpen(false)}
      open={dropdownOpen}
      popupClassName="dropdownClassNameSelector"
      dropdownRender={() => {
        if (loading) {
          return (
            <SpinWrapper>
              <Spin />
            </SpinWrapper>
          );
        }
        if (providers && providers.length > 0) {
          return (
            <Table
              bordered
              columns={columns}
              dataSource={providers}
              rowKey="providerId"
              pagination={false}
              rowClassName="rowTableClassName"
              size="large"
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
            <Empty description="Không tìm thấy nhà cung cấp" />
          </EmptyWrapper>
        );
      }}
      optionLabelProp="label"
      dropdownStyle={{ minWidth: "400px" }}
    >
      {selectedProvider && (
        <Select.Option
          key={selectedProvider.providerId}
          value={selectedProvider.providerId}
          label={`${selectedProvider.providerName} (${selectedProvider.phoneNumber})`}
        >
          {selectedProvider.providerName}
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

export default ProviderSelector;
