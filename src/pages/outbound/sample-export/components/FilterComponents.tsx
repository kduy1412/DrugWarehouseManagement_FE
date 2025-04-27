import { Button, DatePicker, Input, Space } from "antd";
import React, { useCallback, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { cleanFilterParams } from "../../../../utils/cleanNullOrEmpty";
import { LotGetQueryParams, LotGetRequestParams } from "../../../../types/lot";
import ProviderSelector from "../../../../components/provider/ProviderSelector";
import { Provider, ProviderGetRequestParams } from "../../../../types/provider";
import { useGetProviderQuery } from "../../../../hooks/api/provider/getProviderQuery";
import { Product, ProductGetRequestParams } from "../../../../types/product";
import { useGetProductQuery } from "../../../../hooks/api/product/getProductQuery";
import ProductSelector from "../../../../components/product/ProductSelector";
import styled from "styled-components";

interface ComponentProps {
  setQuery: React.Dispatch<React.SetStateAction<LotGetRequestParams>>;
  initialQueryParams: LotGetRequestParams;
  query: LotGetRequestParams;
}
const initialFilterParams: LotGetRequestParams = {
  Page: 1,
  PageSize: 10,
};

const FilterComponent = ({
  setQuery,
  initialQueryParams,
  query,
}: ComponentProps) => {
  const [filterParam, setFilterParam] =
    useState<LotGetQueryParams>(initialFilterParams);
  const [providerFilterParams, setProviderFilterParams] =
    useState<ProviderGetRequestParams>({
      Page: 1,
      PageSize: 1000,
      Search: null,
    });

  const [productFilterParams, setProductFilterParams] =
    useState<ProductGetRequestParams>({
      Page: 1,
      PageSize: 1000,
      Search: null,
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
    setProviderFilterParams((prev) => ({
      ...prev,
      Search: value,
    }));
  }, []);

  const onSearchProductChange = useCallback((value: string) => {
    setProductFilterParams((prev) => ({
      ...prev,
      Search: value,
    }));
  }, []);

  const onSelectedProvider = (record: Provider | null) => {
    setQuery((prev) => ({
      ...prev,
      ProviderId: record?.providerId,
      Page: 1,
    }));
  };

  const onSelectedProduct = (record: Product | null) => {
    setQuery((prev) => ({
      ...prev,
      ProductId: record?.productId,
      Page: 1,
    }));
  };

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
