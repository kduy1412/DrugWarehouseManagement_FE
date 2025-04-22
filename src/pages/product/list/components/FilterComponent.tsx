import { Button, DatePicker, Input, Space } from "antd";
import React, { useCallback, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { cleanFilterParams } from "../../../../utils/cleanNullOrEmpty";
import {
  ProductFilterParams,
  ProductGetRequestParams,
} from "../../../../types/product";
import CategorySelector from "../../../../components/category/CategorySelector";
import styled from "styled-components";
import { Category, CategoryGetRequestParams } from "../../../../types/category";
import { useGetCategoriesQuery } from "../../../../hooks/api/category/getCategoriesQuery";
import { SystemCategoryConfigEnum } from "../../../../types/enums/system";

interface ComponentProps {
  setQuery: React.Dispatch<React.SetStateAction<ProductGetRequestParams>>;
  initialQueryParams: ProductGetRequestParams;
}

const initialFilterParams: ProductFilterParams = {
  Search: "",
  DateFrom: null,
  DateTo: null,
};

const initialCategoryFilterParams: CategoryGetRequestParams = {
  Page: 1,
  PageSize: 100,
  IsMainCategory: false,
};

const FilterComponent = ({ setQuery, initialQueryParams }: ComponentProps) => {
  const [filterParam, setFilterParam] =
    useState<ProductFilterParams>(initialFilterParams);

  const [categoryFilterParams, setCategoryFilterParams] = useState(
    initialCategoryFilterParams
  );

  const { data, isLoading } = useGetCategoriesQuery(categoryFilterParams);

  const setDateFrom = (date: Dayjs | null) => {
    setFilterParam((prev) => ({
      ...prev,
      DateFrom: date ? dayjs(date).toISOString() : null,
    }));
  };

  const setDateTo = (date: Dayjs | null) => {
    setFilterParam((prev) => ({
      ...prev,
      DateTo: date ? dayjs(date).toISOString() : null,
    }));
  };

  const setSearchValue = (value: string) => {
    setFilterParam((prev) => ({
      ...prev,
      Search: value,
    }));
  };

  const onSearchCategoryChange = useCallback((value: string) => {
    setCategoryFilterParams((prev) => ({
      ...prev,
      Search: value,
    }));
  }, []);

  const onSelectedCategory = (record: Category | null) =>
    setQuery((prev) => ({
      ...prev,
      CategoryId: record?.categoriesId,
      Page: 1,
    }));

  const handleSearch = () => {
    const cleanParams = cleanFilterParams(filterParam);
    setQuery((prev) => ({
      ...prev,
      ...cleanParams,
      Page: 1,
    }));
  };

  const handleReset = () => {
    setQuery(initialQueryParams);
    setFilterParam(initialFilterParams);
  };

  const subCategory = data?.items.filter(
    (item) =>
      item.parentCategoryId !== SystemCategoryConfigEnum.SKUId &&
      item.parentCategoryId !== SystemCategoryConfigEnum.ReportId &&
      item.parentCategoryId !== SystemCategoryConfigEnum.OtherId
  );

  return (
    <StyledSpace
      direction="horizontal"
      size="middle"
      style={{ marginBottom: 16 }}
    >
      <Input
        placeholder="Nhập từ khóa tìm kiếm"
        value={filterParam.Search ?? ""}
        onChange={(e) => setSearchValue(e.target.value)}
        onPressEnter={handleSearch}
        style={{ width: 200 }}
      />
      <DatePicker
        placeholder="Từ ngày"
        value={filterParam.DateFrom ? dayjs(filterParam.DateFrom) : null}
        onChange={setDateFrom}
        format="DD/MM/YYYY"
        style={{ width: 150 }}
      />
      <DatePicker
        placeholder="Đến ngày"
        value={filterParam.DateTo ? dayjs(filterParam.DateTo) : null}
        onChange={setDateTo}
        format="DD/MM/YYYY"
        disabledDate={(current) =>
          filterParam.DateFrom && current
            ? current.isBefore(dayjs(filterParam.DateFrom), "day")
            : false
        }
        style={{ width: 150 }}
      />
      <CategorySelector
        categories={subCategory}
        onSearchValueChange={onSearchCategoryChange}
        onSelectedCategoryChange={onSelectedCategory}
        value={filterParam.CategoryId}
        loading={isLoading}
      />
      <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
        Tìm kiếm
      </Button>
      <Button onClick={handleReset}>Đặt lại</Button>
    </StyledSpace>
  );
};

export default FilterComponent;

const StyledSpace = styled(Space)`
  flex-wrap: wrap;
  max-width: 90%;
`;
