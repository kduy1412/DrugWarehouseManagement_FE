import { Button, DatePicker, Input, Space } from "antd";
import React, { useCallback, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { cleanFilterParams } from "../../../../utils/cleanNullOrEmpty";
import { LotGetQueryParams, LotGetRequestParams } from "../../../../types/lot";
import ProviderSelector from "../../../../components/provider/ProviderSelector";
import ProductSelector from "../../../../components/product/ProductSelector";
import WarehouseSelector from "../../../../components/warehouse/WarehouseSelector";
import styled from "styled-components";
import { ProviderGetRequestParams } from "../../../../types/provider";
import {
  ProductGetRequestParams,
  ProductStatus,
} from "../../../../types/product";
import {
  WarehouseGetRequestParams,
  WarehouseStatus,
} from "../../../../types/warehouse";
import { useGetProviderQuery } from "../../../../hooks/api/provider/getProviderQuery";
import { useGetProductQuery } from "../../../../hooks/api/product/getProductQuery";
import { useGetWarehouseQuery } from "../../../../hooks/api/warehouse/getWarehouseQuery";
import { SystemWarehouseConfigEnum } from "../../../../types/enums/system";

interface ComponentProps {
  setQuery: React.Dispatch<React.SetStateAction<LotGetRequestParams>>;
  initialQueryParams: LotGetRequestParams;
  query: LotGetRequestParams;
}

const FilterComponent = ({
  setQuery,
  initialQueryParams,
  query,
}: ComponentProps) => {
  const [filterParam, setFilterParam] =
    useState<LotGetQueryParams>(initialQueryParams);
  const [providerFilterParams, setProviderFilterParams] =
    useState<ProviderGetRequestParams>({
      Page: 1,
      PageSize: 1000,
      Search: null,
    });
  const [productFilterParams, setProductFilterParams] =
    useState<ProductGetRequestParams>({
      Page: 1,
      PageSize: 100,
      Search: null,
      Status: ProductStatus.Active,
    });

  const { data: queryProvider, isLoading: providerQueryLoading } =
    useGetProviderQuery(providerFilterParams);
  const { data: queryProduct, isLoading: productQueryLoading } =
    useGetProductQuery(productFilterParams);

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

  const onSearchProviderChange = useCallback((value: string) => {
    setProviderFilterParams((prev) => ({ ...prev, Search: value }));
  }, []);

  const onSearchProductChange = useCallback((value: string) => {
    setProductFilterParams((prev) => ({ ...prev, Search: value }));
  }, []);

  const onSelectedProvider = (record: any | null) => {
    setQuery((prev) => ({
      ...prev,
      ProviderId: record?.providerId,
    }));
  };

  const onSelectedProduct = (record: any | null) => {
    setQuery((prev) => ({
      ...prev,
      ProductId: record?.productId,
    }));
  };

  const handleSearch = () => {
    const cleanParams = cleanFilterParams(filterParam);
    setQuery((prev) => ({
      ...prev,
      ...cleanParams,
    }));
  };

  const handleReset = () => {
    setQuery(initialQueryParams);
    setFilterParam(initialQueryParams);
  };

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
      <ProviderSelector
        value={query.ProviderId}
        onSearchValueChange={onSearchProviderChange}
        onSelectedProviderChange={onSelectedProvider}
        providers={queryProvider?.items}
        loading={providerQueryLoading}
      />
      <ProductSelector
        value={query.ProductId}
        onSearchValueChange={onSearchProductChange}
        onSelectedProductChange={onSelectedProduct}
        products={queryProduct?.items}
        loading={productQueryLoading}
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
  max-width: 100%;
`;
