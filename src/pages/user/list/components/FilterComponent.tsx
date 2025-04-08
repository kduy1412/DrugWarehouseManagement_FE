import { Button, DatePicker, Input, Space } from "antd";
import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { cleanFilterParams } from "../../../../utils/cleanNullOrEmpty";
import { UserFilterParams, UserGetRequestParams } from "../../../../types/user";

interface ComponentProps {
  setQuery: (params: Partial<UserGetRequestParams>) => void;
  resetFilter: () => void;
  initialQueryParams: UserGetRequestParams;
}

const initialFilterParams: UserFilterParams = {
  Search: "",
  DateFrom: null,
  DateTo: null,
};

const FilterComponent = ({
  setQuery,
  initialQueryParams,
  resetFilter,
}: ComponentProps) => {
  const [filterParam, setFilterParam] =
    useState<UserFilterParams>(initialFilterParams);

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

  const handleSearch = () => {
    const cleanParams = cleanFilterParams(filterParam);
    setQuery(cleanParams);
  };

  const handleReset = () => {
    resetFilter();
    setFilterParam(initialFilterParams);
  };

  return (
    <Space direction="horizontal" size="middle" style={{ marginBottom: 16 }}>
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
      <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
        Tìm kiếm
      </Button>
      <Button onClick={handleReset}>Đặt lại</Button>
    </Space>
  );
};

export default FilterComponent;
