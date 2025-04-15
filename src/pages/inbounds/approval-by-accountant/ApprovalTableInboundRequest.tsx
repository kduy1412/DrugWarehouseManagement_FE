import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import { parseToVietNameseCurrency } from "../../../utils/parseToVietNameseCurrency";

interface DataType {
  key: string;
  name: string;
  quantity: number;
  unitprice: number;
  totalprice: number;
}

interface ApprovalTableProps {
  listInboundRequest: {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Đơn giá",
    dataIndex: "unitprice",
    key: "unitprice",
    render: (_, { unitprice }) => renderPrice(unitprice),
  },
  {
    title: "Tổng giá",
    dataIndex: "totalprice",
    key: "totalprice",
    render: (_, { totalprice }) => renderPrice(totalprice),
  },
];

const ApprovalTableInboundRequest: React.FC<ApprovalTableProps> = ({
  listInboundRequest,
}) => {
  const data: DataType[] = listInboundRequest.map((item, index) => ({
    key: index.toString(),
    name: item.productName,
    quantity: item.quantity,
    unitprice: item.unitPrice,
    totalprice: item.totalPrice,
  }));

  const totalPrice = listInboundRequest.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  return (
    <Table<DataType>
      columns={columns}
      dataSource={data}
      summary={() => (
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={3}>
            <strong>Tổng cộng</strong>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={3}>
            <strong>{parseToVietNameseCurrency(totalPrice)}</strong>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      )}
    />
  );
};

export default ApprovalTableInboundRequest;

const renderPrice = (price: number) => {
  return <p>{parseToVietNameseCurrency(price)}</p>;
};
