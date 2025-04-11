import { useDebounce } from "@uidotdev/usehooks";
import { RefSelectProps, Select, Spin, Table, TableProps, Empty } from "antd";
import { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Category } from "../../types/category";

interface CategorySelectorProps {
  value: number | null | undefined;
  onSelectedCategoryChange: (category: Category | null) => void;
  onSearchValueChange: (value: string) => void;
  categories: Category[] | undefined;
  loading?: boolean;
  placeholder?: string;
}

const CategorySelector = ({
  value,
  onSelectedCategoryChange,
  onSearchValueChange,
  categories,
  loading = false,
  placeholder = "Chọn danh mục",
}: CategorySelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const selectRef = useRef<RefSelectProps>(null);

  useEffect(() => {
    onSearchValueChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchValueChange]);

  const handleRowClick = (record: Category) => {
    onSelectedCategoryChange(record);
    setDropdownOpen(false);
    setSearchTerm("");
    selectRef.current?.blur();
  };

  const columns: TableProps<Category>["columns"] = [
    { title: "Tên danh mục", dataIndex: "categoryName", key: "categoryName" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
  ];

  const selectedCategory = categories?.find((c) => c.categoriesId === value);

  return (
    <StyledSelect
      ref={selectRef}
      placeholder={placeholder}
      showSearch
      allowClear
      value={value}
      onSearch={setSearchTerm}
      onFocus={() => setDropdownOpen(true)}
      onClear={() => onSelectedCategoryChange(null)}
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
        if (categories && categories.length > 0) {
          return (
            <Table
              columns={columns}
              dataSource={categories}
              rowKey="categoriesId"
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
            <Empty description="Không tìm thấy danh mục" />
          </EmptyWrapper>
        );
      }}
      optionLabelProp="label"
      dropdownStyle={{ minWidth: "400px" }}
    >
      {selectedCategory && (
        <Select.Option
          key={selectedCategory.categoriesId}
          value={selectedCategory.categoriesId}
          label={`${selectedCategory.categoryName} (${selectedCategory.status})`}
        >
          {selectedCategory.categoryName}
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

export default CategorySelector;
