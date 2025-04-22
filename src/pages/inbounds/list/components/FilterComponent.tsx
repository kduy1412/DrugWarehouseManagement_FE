import { Button, Checkbox, DatePicker, Input, Select, Space, Tag } from "antd";
import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { cleanFilterParams } from "../../../../utils/cleanNullOrEmpty";
import {
  InboundFilterParams,
  InboundGetRequestParams,
  InboundStatus,
  InboundStatusAsString,
  InboundStatusColors,
} from "../../../../types/inbound";
import { parseInboundStatusToVietnamese } from "../../../../utils/translateInboundStatus";
import styled from "styled-components";

interface ComponentProps {
  setQuery: React.Dispatch<React.SetStateAction<InboundGetRequestParams>>;
  initialQueryParams: InboundGetRequestParams;
}

const initialFilterParams: InboundFilterParams = {
  Search: "",
  DateFrom: null,
  DateTo: null,
  IsReportPendingExist: false,
};

const FilterComponent = ({ setQuery, initialQueryParams }: ComponentProps) => {
  const [filterParam, setFilterParam] =
    useState<InboundFilterParams>(initialFilterParams);

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
    setQuery((prev) => ({
      ...prev,
      ...cleanParams,
      Page: 1,
    }));
  };

  const handleOnStatusChange = (value: InboundStatus) => {
    setQuery((prev) => ({
      ...prev,
      InboundStatus: value,
      Page: 1,
    }));
    setFilterParam((prev) => ({
      ...prev,
      InboundStatus: value,
      Page: 1,
    }));
  };

  const onReportExist = (isChecked: boolean) => {
    if (isChecked) {
      setFilterParam((prev) => ({
        ...prev,
        IsReportPendingExist: !prev.IsReportPendingExist,
        InboundStatus: InboundStatus.Pending,
      }));

      setQuery((prev) => ({
        ...prev,
        IsReportPendingExist: !prev.IsReportPendingExist,
        InboundStatus: InboundStatus.Pending,
        Page: 1,
      }));
    } else {
      setFilterParam((prev) => ({
        ...prev,
        IsReportPendingExist: !prev.IsReportPendingExist,
        InboundStatus: null,
      }));

      setQuery((prev) => ({
        ...prev,
        IsReportPendingExist: !prev.IsReportPendingExist,
        InboundStatus: null,
        Page: 1,
      }));
    }
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
      <Select
        placeholder="Chọn trạng thái"
        value={filterParam.InboundStatus}
        onChange={(value) => handleOnStatusChange(value)}
        dropdownStyle={{ width: "fit-content" }}
        disabled={filterParam.IsReportPendingExist ?? false}
      >
        {Object.keys(InboundStatus)
          .filter((key) => isNaN(Number(key)))
          .map((inboundStatusName) => {
            const inboundStatusValue =
              InboundStatus[inboundStatusName as keyof typeof InboundStatus];
            return (
              <Select.Option
                key={inboundStatusValue}
                value={inboundStatusValue}
              >
                <Tag color={InboundStatusColors[inboundStatusValue - 1]}>
                  {parseInboundStatusToVietnamese(
                    InboundStatusAsString[inboundStatusValue]
                  )}
                </Tag>
              </Select.Option>
            );
          })}
      </Select>
      <Checkbox
        checked={filterParam.IsReportPendingExist ?? false}
        onChange={(e) => onReportExist(e.target.checked)}
      >
        Báo cáo nhập kho đang chờ duyệt
      </Checkbox>
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
