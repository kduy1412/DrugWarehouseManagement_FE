import React, { useState } from "react";
import {
  OutboundDetail,
  OutboundGetRequestParams,
  OutboundGetView,
  OutboundReturnDetailsRequest,
  OutboundReturnRequest,
  OutboundStatus,
  OutboundStatusColors,
} from "../../../types/outbound";
import { useGetOutBoundQuery } from "../../../hooks/api/outbound/getOutboundQuery";
import {
  Button,
  Divider,
  Flex,
  Input,
  InputNumber,
  notification,
  Pagination,
  PaginationProps,
  Spin,
  Table,
  TableProps,
  Tag,
} from "antd";
import { formatDateTime } from "../../../utils/timeHelper";
import { parseOutboundStatusToVietnamese } from "../../../utils/translateOutboundStatus";
import styled from "styled-components";
import { TableRowSelection } from "antd/es/table/interface";
import { DeleteOutlined, UndoOutlined } from "@ant-design/icons";
import FilterComponent from "./components/FilterComponent";
import { parseToVietNameseCurrency } from "../../../utils/parseToVietNameseCurrency";
import { useCreateReturnOutboundMutation } from "../../../hooks/api/outbound/createReturnOutboundMutation";
import { redirect } from "react-router-dom";

/**Types */
type DataType = OutboundGetView;

type OutboundReturnDetailsView = OutboundReturnDetailsRequest &
  Pick<OutboundDetail, "productName" | "lotNumber">;

interface OutboundDetailsProps {
  onRemove: (index: number) => void;
  onQuantityChange: (index: number, value: number) => void;
  onNoteChange: (index: number, value: string) => void;
}

const initialData: OutboundGetRequestParams = {
  Page: 1,
  PageSize: 10,
  Status: OutboundStatus.Completed,
};

const ReturnOutboundPage = () => {
  /** Hooks */
  const [initParams, setInitParams] =
    useState<OutboundGetRequestParams>(initialData);
  const { data, isLoading } = useGetOutBoundQuery(initParams);
  const { mutate, isPending } = useCreateReturnOutboundMutation();
  const [selectedOutboundRowKeys, setSelectedOutboundRowKeys] = useState<
    React.Key[]
  >([]);
  const [
    selectedOutboundDetailsReturnData,
    setSelectedOutboundDetailsReturnData,
  ] = useState<OutboundReturnDetailsView[]>([]);

  const [selectedOutboundDetailsRowKeys, setSelectedOutboundDetailsRowKeys] =
    useState<React.Key[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Column Def
  const outboundColumns: TableProps<DataType>["columns"] = [
    {
      title: "#",
      dataIndex: "outboundId",
      key: "outboundId",
      render: (index, _) => <strong>{index}</strong>,
    },
    {
      title: "Mã Phiếu",
      dataIndex: "outboundCode",
      key: "outboundCode",
      render: (_, { outboundCode }) => <p>{outboundCode}</p>,
    },
    {
      title: "Tên Khách Hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (_, { customerName: customerName }) => <p>{customerName}</p>,
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
      render: (_, { receiverAddress: address }) => {
        if (address) {
          return <p>{address}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
    },
    {
      title: "Liên Hệ",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (_, { receiverPhone: phoneNumber }) => {
        if (phoneNumber) {
          return <p>{phoneNumber}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
    },
    {
      title: "Ngày Xuất Kho",
      dataIndex: "outboundDate",
      key: "outboundDate",
      render: (_, { outboundDate }) => {
        if (outboundDate) {
          return <p>{formatDateTime(new Date(outboundDate))}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
    },
    {
      title: "Mã Vận Đơn",
      dataIndex: "outboundOrderCode",
      key: "outboundOrderCode",
      render: (_, { outboundOrderCode }) => {
        if (outboundOrderCode) {
          return <p>{outboundOrderCode}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        const color = OutboundStatusColors[status - 1];
        return (
          <Tag color={color}>{parseOutboundStatusToVietnamese(status)}</Tag>
        );
      },
    },
  ];

  const outboundDetailsColumns: TableProps<OutboundDetail>["columns"] = [
    {
      dataIndex: "outboundDetailsId",
      key: "outboundDetailsId",
      sorter: (a, b) => a.outboundDetailsId - b.outboundDetailsId,
    },
    {
      title: "Lot ID",
      dataIndex: "lotId",
      key: "lotId",
      sorter: (a, b) => a.lotId - b.lotId,
    },
    {
      title: "Lot Number",
      dataIndex: "lotNumber",
      key: "lotNumber",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (value: string | null) => value || "N/A",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Đơn Giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (value: number) => `${parseToVietNameseCurrency(value)}`,
      sorter: (a, b) => a.unitPrice - b.unitPrice,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value: number) => `${parseToVietNameseCurrency(value)}`,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Unit Type",
      dataIndex: "unitType",
      key: "unitType",
    },

    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (value: Date) => {
        if (value) {
          return <p>{formatDateTime(new Date(value))}</p>;
        }
        return <Tag color="warning">Chưa xác định</Tag>;
      },
      sorter: (a, b) => a.expiryDate.getTime() - b.expiryDate.getTime(),
    },
  ];

  const outboundDetailsReturnedColumns = ({
    onRemove,
    onQuantityChange,
    onNoteChange,
  }: OutboundDetailsProps): TableProps<OutboundReturnDetailsView>["columns"] => [
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Số Lô",
      dataIndex: "lotNumber",
      key: "lotNumber",
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (
        quantity: number,
        record: OutboundReturnDetailsView,
        index: number
      ) => (
        <InputNumber
          min={0}
          value={quantity}
          max={selectedData[index]?.quantity ?? 0}
          onChange={(value) => onQuantityChange(index, value ?? 0)}
          style={{ width: "100%", maxWidth: "100px" }}
        />
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (
        note: string,
        record: OutboundReturnDetailsView,
        index: number
      ) => (
        <StyledTextArea
          placeholder="Nhập ghi chú"
          autoSize={{ minRows: 2, maxRows: 6 }}
          onChange={(e) => onNoteChange(index, e.target.value)}
        />
      ),
    },
    {
      key: "action",
      render: (
        _: unknown,
        record: OutboundReturnDetailsView,
        index: number
      ) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemove(index)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  // Helpers
  const handleOnChange: PaginationProps["onChange"] = (page) => {
    setInitParams((prev) => ({
      ...prev,
      Page: page,
    }));
  };
  const handleOnShowSizeChange: PaginationProps["onShowSizeChange"] = (
    _,
    pageSize
  ) => {
    setInitParams((prev) => ({
      ...prev,
      PageSize: pageSize,
      Page: 1,
    }));
  };

  //  Handle on Select and Remove Outbound Details
  const onOutboundSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedOutboundRowKeys(newSelectedRowKeys);
    setCurrentStep(2);
  };
  const outboundRowSelection: TableRowSelection<DataType> = {
    selectedRowKeys: selectedOutboundRowKeys,
    onChange: onOutboundSelectChange,
  };

  //  Handle on Select and Remove Outbound Return Details
  const onOutboundDetailsSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedOutboundDetailsRowKeys(newSelectedRowKeys);
  };
  const outboundDetailsRowSelection: TableRowSelection<OutboundDetail> = {
    selectedRowKeys: selectedOutboundDetailsRowKeys,
    onChange: onOutboundDetailsSelectChange,
  };
  const handleRemove = (index: number) => {
    setSelectedOutboundDetailsReturnData((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  //  Handle on change Outbound Return Details
  const handleQuantityChange = (index: number, value: number) => {
    setSelectedOutboundDetailsReturnData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: value } : item))
    );
  };
  const handleNoteChange = (index: number, value: string) => {
    setSelectedOutboundDetailsReturnData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, note: value } : item))
    );
  };

  //  Form Action
  const handleOnClickButtonReturn = () => {
    const data = selectedData.map<OutboundReturnDetailsView>((item, index) => ({
      outboundDetailsId: item.outboundDetailsId,
      note: selectedOutboundDetailsReturnData[index]?.note ?? null,
      quantity: item.quantity,
      lotNumber: item.lotNumber,
      productName: item.productName,
    }));
    setSelectedOutboundDetailsReturnData(data);
  };

  const handleOnSubmit = () => {
    const mapToReturnDetails =
      selectedOutboundDetailsReturnData.map<OutboundReturnDetailsRequest>(
        (item) => ({
          outboundDetailsId: item.outboundDetailsId,
          quantity: item.quantity,
          note: item.note,
        })
      );
    if (!selectedItem) {
      notification.error({
        message: "Chưa Chọn Sản Phẩm",
        description: "Sản phẩm chưa được chọn vụi lòng chọn sản phẩm!",
      });
      return;
    }

    const submitData: OutboundReturnRequest = {
      details: mapToReturnDetails,
      outboundId: selectedItem.outboundId,
    };

    mutate(submitData, {
      onSuccess: () => {
        setSelectedOutboundRowKeys([]);
        setSelectedOutboundDetailsReturnData([]);
        redirect("/outbound/history");
      },
    });
  };

  //  Mapping outboundDetails Data from outboundData
  const selectedItem = data?.items.find((item) =>
    selectedOutboundRowKeys.includes(item.outboundId)
  );
  const outboundDetailsData = selectedItem?.outboundDetails || [];
  const selectedData = outboundDetailsData.filter((item) =>
    selectedOutboundDetailsRowKeys.includes(item.outboundDetailsId)
  );

  return (
    <>
      {currentStep === 1 && (
        <FilterComponent
          initialQueryParams={initialData}
          setQuery={setInitParams}
        />
      )}
      {/* Step 1 - Choose Existing Outbound with "Done" status */}
      {data && currentStep === 1 && (
        <>
          <Table<DataType>
            bordered
            pagination={false}
            dataSource={data.items}
            columns={outboundColumns}
            rowKey={(record) => record.outboundId}
            rowSelection={outboundRowSelection}
          />
          <StyledPagination
            showSizeChanger
            align="end"
            defaultCurrent={1}
            total={data.totalCount}
            pageSize={data.pageSize}
            current={initParams.Page}
            onChange={handleOnChange}
            onShowSizeChange={handleOnShowSizeChange}
          />
        </>
      )}
      {/*Step 2 - Select Outbound Details that has returned from that inbound and submit*/}
      {selectedOutboundRowKeys.length === 1 && currentStep === 2 && (
        <div>
          <StyledDivider orientation="left">
            Danh sách lô đã cung cấp
          </StyledDivider>
          <Table
            columns={outboundDetailsColumns}
            dataSource={outboundDetailsData}
            rowKey={(record) => record.outboundDetailsId}
            pagination={false}
            rowSelection={outboundDetailsRowSelection}
            bordered
          />
          <StyledFlexContainer justify="center" align="center">
            <CtaButton
              disabled={selectedOutboundDetailsRowKeys.length <= 0}
              icon={<UndoOutlined />}
              type="primary"
              onClick={handleOnClickButtonReturn}
            >
              Hoàn Trả
            </CtaButton>
          </StyledFlexContainer>

          <StyledDivider orientation="left">
            Danh sách lô đã hoàn trả
          </StyledDivider>
          <Table
            bordered
            columns={outboundDetailsReturnedColumns({
              onRemove: handleRemove,
              onQuantityChange: handleQuantityChange,
              onNoteChange: handleNoteChange,
            })}
            dataSource={selectedOutboundDetailsReturnData}
            rowKey="lotNumber"
            pagination={false}
          />
          <StyledFlexContainer justify="end">
            <CtaButton
              disabled={selectedOutboundDetailsReturnData.length <= 0}
              type="primary"
              onClick={handleOnSubmit}
              loading={isPending}
            >
              Xác Nhận
            </CtaButton>
          </StyledFlexContainer>
        </div>
      )}
      {isLoading && (
        <Flex justify="center" align="center" style={{ height: "100%" }}>
          <Spin />
        </Flex>
      )}
    </>
  );
};

export default ReturnOutboundPage;

const StyledPagination = styled(Pagination)`
  margin-top: var(--line-width-light);
`;

const StyledDivider = styled(Divider)`
  border-color: var(--color-placeholder) !important;
  color: var(--color-secondary-600) !important;
  font-weight: var(--font-weight-semibold) !important;
`;

const StyledFlexContainer = styled(Flex)`
  margin-top: var(--line-width-thin);
`;

const CtaButton = styled(Button)`
  width: 10rem !important;
  height: 3rem !important;
  &:not(:disabled) {
    color: white !important;
  }
  border-color: transparent !important;
  background-color: var(--color-secondary-600);
  &:not(:disabled):hover {
    background-color: var(--color-secondary-500) !important;
  }
`;

const StyledTextArea = styled(Input.TextArea)`
  resize: vertical;
`;
