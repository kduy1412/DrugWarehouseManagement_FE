import { useDebounce } from "@uidotdev/usehooks";
import { RefSelectProps, Select, Spin, Table, TableProps, Empty } from "antd";
import { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Product } from "../../types/product"; // Assuming this contains product view type

interface ProductSelectorProps {
  value: number | null | undefined;
  onSelectedProductChange: (product: Product | null) => void;
  onSearchValueChange: (value: string) => void;
  products: Product[] | undefined;
  loading?: boolean;
  placeholder?: string;
}

const ProductSelector = ({
  value,
  onSelectedProductChange,
  onSearchValueChange,
  products,
  loading = false,
  placeholder = "Chọn sản phẩm",
}: ProductSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const selectRef = useRef<RefSelectProps>(null);

  useEffect(() => {
    onSearchValueChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchValueChange]);

  const handleRowClick = (record: Product) => {
    onSelectedProductChange(record);
    setDropdownOpen(false);
    setSearchTerm("");
    selectRef.current?.blur();
  };

  const columns: TableProps<Product>["columns"] = [
    { title: "Tên sản phẩm", dataIndex: "productName", key: "productName" },
    { title: "Mã sản phẩm", dataIndex: "productCode", key: "productCode" },
    { title: "Loại", dataIndex: "sku", key: "sku" },
  ];

  const selectedProduct = products?.find((p) => p.productId === value);

  return (
    <StyledSelect
      ref={selectRef}
      placeholder={placeholder}
      showSearch
      allowClear
      value={value}
      onSearch={setSearchTerm}
      onFocus={() => setDropdownOpen(true)}
      onClear={() => onSelectedProductChange(null)}
      popupClassName="dropdownClassNameSelector"
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
        if (products && products.length > 0) {
          return (
            <Table
              columns={columns}
              dataSource={products}
              rowKey="productId"
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
            <Empty description="Không tìm thấy sản phẩm" />
          </EmptyWrapper>
        );
      }}
      optionLabelProp="label"
      dropdownStyle={{ minWidth: "400px" }}
    >
      {selectedProduct && (
        <Select.Option
          key={selectedProduct.productId}
          value={selectedProduct.productId}
          label={`${selectedProduct.productName} (${selectedProduct.productCode})`}
        >
          {selectedProduct.productName}
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

export default ProductSelector;
