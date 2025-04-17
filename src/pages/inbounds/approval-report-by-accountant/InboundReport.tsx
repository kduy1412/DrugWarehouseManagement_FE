import React, { useEffect, useState } from "react";
import { InputNumber, Table } from "antd";
import { InboundDetail } from "../../../types/inbound";
import { formatDateTime } from "../../../utils/timeHelper";

interface Lot extends InboundDetail {
  updateQuantity: number;
}

interface InboundReportProps {
  lot: InboundDetail[];
  setLot: any;
}

const InboundReport: React.FC<InboundReportProps> = ({ lot, setLot }) => {
  const [data, setData] = useState<Lot[]>(
    lot.map((item) => ({
      ...item,
      updateQuantity: item.quantity,
    }))
  );

  const handleOnQuantityChange = (value: number, record: Lot) => {
    setData((prev) => {
      return prev.map((item) => {
        if (item.lotNumber === record.lotNumber) {
          return {
            ...item,
            updateQuantity: value,
          };
        }
        return item;
      });
    });
  };

  useEffect(() => {
    setLot(data);
  }, [data]);

  const columns = [
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
    {
      title: "Số lượng thực tế",
      dataIndex: "actualQuantity",
      key: "actualQuantity",
      render: (_: unknown, record: Lot) => (
        <InputNumber
          value={record.updateQuantity}
          min={0}
          onChange={(value) => {
            if (value !== null) handleOnQuantityChange(value, record);
          }}
        />
      ),
    },
  ];

  return (
    <Table<Lot>
      bordered
      dataSource={data}
      columns={columns}
      rowKey="inboundId"
      pagination={false}
    />
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

export default InboundReport;
