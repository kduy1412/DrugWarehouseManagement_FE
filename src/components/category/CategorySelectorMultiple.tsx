import { useDebounce } from "@uidotdev/usehooks";
import { RefSelectProps, Select, Spin, Table, TableProps, Empty } from "antd";
import { useRef, useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Category } from "../../types/category";
import { ProductCategoriesPutRequest } from "../../types/product";

interface CategorySelectorProps {
  value: ProductCategoriesPutRequest[];
  onSelectedCategoryChange: (record: Category) => void;
  onSearchValueChange: (value: string) => void;
  categories: Category[] | undefined;
  loading?: boolean;
  placeholder?: string;
  onRemoveSelectedCategory: (existingCategory: number[]) => void;
}

const CategorySelectorMultiple = ({
  value = [],
  onSelectedCategoryChange,
  onSearchValueChange,
  categories,
  loading = false,
  placeholder = "Chọn danh mục",
  onRemoveSelectedCategory,
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
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  const columns: TableProps<Category>["columns"] = [
    { title: "Tên danh mục", dataIndex: "categoryName", key: "categoryName" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
  ];

  const selectedCategories = useMemo(() => {
    return (categories || []).filter((c) =>
      value.some((item) => item.categoriesId === c.categoriesId)
    );
  }, [categories, value]);

  const selectedCategoryIds = useMemo(
    () => value.map((item) => item.categoriesId),
    [value]
  );

  return (
    <StyledSelect
      ref={selectRef}
      placeholder={placeholder}
      showSearch
      allowClear
      onChange={(value) => onRemoveSelectedCategory(value as number[])}
      mode="multiple"
      value={selectedCategoryIds}
      onSearch={setSearchTerm}
      onFocus={() => setDropdownOpen(true)}
      onClear={handleClear}
      popupClassName="dropdownClassNameSelector"
      onBlur={() => !isHovered && setDropdownOpen(false)}
      className="selectMultipleCategory"
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
              bordered
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
      dropdownStyle={{ minWidth: "400px" }}
    >
      {selectedCategories.map((category) => (
        <Select.Option
          key={category.categoriesId}
          value={category.categoriesId}
          label={`${category.categoryName}`}
        >
          {category.categoryName}
        </Select.Option>
      ))}
    </StyledSelect>
  );
};

const StyledSelect = styled(Select)`
  .ant-select-selector {
    min-height: 2rem !important;
    width: 100% !important;
    display: flex;
    align-items: center;
  }
  .ant-select-dropdown {
    padding: 0 !important;
  }
  .ant-select-selection-item {
    display: flex;
    align-items: center;
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

export default CategorySelectorMultiple;
