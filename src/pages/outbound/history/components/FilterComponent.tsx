import { Button, DatePicker, Input, Select, Space, Tag } from "antd";
import React, { useCallback, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import {
  OutboundFilterParams,
  OutboundGetRequestParams,
  OutboundStatus,
  OutboundStatusColors,
} from "../../../../types/outbound";
import dayjs, { Dayjs } from "dayjs";
import { cleanFilterParams } from "../../../../utils/cleanNullOrEmpty";
import { parseOutboundStatusToVietnamese } from "../../../../utils/translateOutboundStatus";
import CustomerSelector from "../../../../components/customer/CustomerSelector";
import {
  CustomerGetRequestParams,
  CustomerSelectorGetView,
} from "../../../../types/customer";
import { useGetCustomerQuery } from "../../../../hooks/api/customer/getCustomerQuery";
import styled from "styled-components";

interface ComponentProps {
  setQuery: React.Dispatch<React.SetStateAction<OutboundGetRequestParams>>;
  initialQueryParams: OutboundGetRequestParams;
}

const initialFilterParams: OutboundFilterParams = {
  Search: "",
  DateFrom: null,
  DateTo: null,
};

const FilterComponent = ({ setQuery, initialQueryParams }: ComponentProps) => {
  const [filterParam, setFilterParam] =
    useState<OutboundFilterParams>(initialFilterParams);

  const [searchParams, setSearchParams] = useState<CustomerGetRequestParams>({
    Page: 1,
    PageSize: 100,
  });
  const { data, isLoading } = useGetCustomerQuery(searchParams);

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

  const onSearchValueChange = useCallback((value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      Search: value,
    }));
  }, []);

  const onSelectedCustomerChange = (
    customer: CustomerSelectorGetView | null
  ) => {
    setQuery((prev) => ({
      ...prev,
      CustomerId: customer?.customerId,
    }));
    setFilterParam((prev) => ({
      ...prev,
      CustomerId: customer?.customerId,
    }));
  };

  const setStatus = (status: OutboundStatus) => {
    setQuery((prev) => ({
      ...prev,
      Status: status,
    }));
    setFilterParam((prev) => ({
      ...prev,
      Status: status,
    }));
  };

  const handleSearch = () => {
    const cleanParams = cleanFilterParams(filterParam);
    setQuery((prev) => ({
      ...prev,
      ...cleanParams,
      Page:1,
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
      <CustomerSelector
        onSearchValueChange={onSearchValueChange}
        onSelectedCustomerChange={onSelectedCustomerChange}
        value={filterParam.CustomerId}
        customers={data?.items}
        loading={isLoading}
      />
      <Select
        placeholder="Chọn trạng thái"
        value={filterParam.Status}
        onChange={(value) => setStatus(value)}
      >
        {Object.keys(OutboundStatus)
          .filter((key) => isNaN(Number(key)))
          .filter((key) => key !== "Public")
          .map((outboundStatusName) => {
            const outboundStatusValue =
              OutboundStatus[outboundStatusName as keyof typeof OutboundStatus];
            return (
              <Select.Option
                key={outboundStatusValue}
                value={outboundStatusValue}
              >
                <Tag color={OutboundStatusColors[outboundStatusValue - 1]}>
                  {parseOutboundStatusToVietnamese(outboundStatusValue)}
                </Tag>
              </Select.Option>
            );
          })}
      </Select>
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
