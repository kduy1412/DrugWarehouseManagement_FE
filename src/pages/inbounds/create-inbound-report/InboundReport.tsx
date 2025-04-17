import React, { useEffect, useState } from "react";
import {
  Alert,
  Flex,
  InputNumber,
  List,
  Table,
  TableProps,
  Typography,
} from "antd";
import { InboundDetail } from "../../../types/inbound";
import { formatDateTime } from "../../../utils/timeHelper";
import { parseToVietNameseCurrency } from "../../../utils/parseToVietNameseCurrency";

interface Lot extends InboundDetail {
  actualQuantity: number;
  note?: string | null;
}

interface InboundReportProps {
  record: {
    lo: InboundDetail[];
  };
  isFulfilled?: boolean;
  setProblemDescription?: React.Dispatch<React.SetStateAction<string>>;
}

const InboundReport: React.FC<InboundReportProps> = ({
  record,
  isFulfilled = true,
  setProblemDescription,
}) => {
  const [data, setData] = useState<Lot[]>(
    isFulfilled
      ? []
      : record.lo.map((item) => ({
          ...item,
          actualQuantity: item.quantity,
          note: null,
        }))
  );

  const baseColumns = [
    {
      title: "Mã lô",
      dataIndex: "lotNumber",
      key: "lotNumber",
    },
    {
      title: "Tên SP",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "NSX",
      dataIndex: "manufacturingDate",
      key: "manufacturingDate",
      render: (date: string) => parseDate(date),
    },
    {
      title: "HSD",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date: string) => parseDate(date),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  const handleOnQuantityChange = (value: number, record: Lot) => {
    const quantityGap = value - record.quantity;
    let message = "";

    if (quantityGap < 0) {
      message = `Lô ${record.lotNumber} thiếu ${quantityGap * -1}`;
    }

    if (quantityGap > 0) {
      message = `Lô ${record.lotNumber} thừa ${quantityGap}`;
    }

    if (message === "") {
      setData((prev) =>
        prev.map((item) => {
          if (item.lotNumber === record.lotNumber) {
            return {
              ...item,
              actualQuantity: value,
              note: null,
            };
          }
          return item;
        })
      );
    } else {
      setData((prev) =>
        prev.map((item) => {
          if (item.lotNumber === record.lotNumber) {
            return {
              ...item,
              actualQuantity: value,
              note: message,
            };
          }
          return item;
        })
      );
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  const columns = isFulfilled
    ? ([
        ...baseColumns,
        {
          title: "Giá thành",
          dataIndex: "unitPrice",
          key: "unitPrice",
          render: (price: number) => renderPrice(price),
        },
        {
          title: "Tổng tiền",
          dataIndex: "totalPrice",
          key: "totalPrice",
          render: (price: number) => renderPrice(price),
        },
      ] as TableProps<InboundDetail>["columns"])
    : ([
        ...baseColumns,
        {
          title: "Số lượng thực tế",
          dataIndex: "actualQuantity",
          key: "actualQuantity",
          render: (_, record: Lot) => (
            <InputNumber
              value={record.actualQuantity}
              min={0}
              onChange={(value) => {
                if (value !== null) handleOnQuantityChange(value, record);
              }}
            />
          ),
        },
        {
          title: "Giá thành",
          dataIndex: "unitPrice",
          key: "unitPrice",
          render: (price: number) => renderPrice(price),
        },
        {
          title: "Tổng tiền",
          dataIndex: "totalPrice",
          key: "totalPrice",
          render: (price: number) => renderPrice(price),
        },
      ] as TableProps<Lot | InboundDetail>["columns"]);

  const problemsList = data.filter((item) => item.note);

  useEffect(() => {
    if (problemsList.length > 0 && setProblemDescription) {
      let description = "";
      problemsList.forEach((item) => (description += item?.note + `\n`));
      setProblemDescription(description);
    } else if (setProblemDescription) {
      setProblemDescription("");
    }
  }, [problemsList]);

  return (
    <>
      <Table<Lot | InboundDetail>
        bordered
        dataSource={!isFulfilled ? data : record.lo}
        columns={columns}
        rowKey="inboundId"
        pagination={false}
      />
      {!isFulfilled && problemsList.length > 0 && (
        <List
          header={
            <p>
              <strong>Lỗi</strong>
              <span
                style={{ fontSize: "var(--font-size-body)" }}
              >{` (Lỗi sẽ được tự động thêm vào trong ghi chú)`}</span>
            </p>
          }
          bordered
          size="small"
          dataSource={problemsList}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text mark>{item.note}</Typography.Text>
            </List.Item>
          )}
          style={{ marginBottom: "var(--line-width-thin)" }}
        />
      )}
    </>
  );
};

// Date parsing utility
const parseDate = (date: string) => {
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return <span>Invalid Date</span>;
  }

  return <span>{formatDateTime(parsedDate, false)}</span>;
};

// Price formatting utility
const renderPrice = (price: number | undefined) => {
  if (price === undefined || price === null) {
    return <span>N/A</span>;
  }
  return <span>{parseToVietNameseCurrency(price)}</span>;
};

export default InboundReport;
