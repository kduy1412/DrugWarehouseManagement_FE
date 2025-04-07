import React from 'react';
import { Table} from 'antd';
import type { TableProps } from 'antd';

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

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Unit Price',
    dataIndex: 'unitprice',
    key: 'unitprice',
  },
  {
    title: 'Total Price',
    dataIndex: 'totalprice',
    key: 'totalprice',
  },
];

// const data: DataType[] = [
//   {
//     key: '1',
//     name: 'A',
//     quantity: 32,
//     unitprice: 1000,
//     totalprice: 1000,
//   },
//     {
//     key: '2',
//     name: '12',
//     quantity: 12,
//     unitprice: 1000,
//     totalprice: 1000,
//   },
// ];

const ApprovalTableInboundRequest: React.FC<ApprovalTableProps> = ({ listInboundRequest }) => {
  // Chuyển đổi dữ liệu từ API thành dạng phù hợp
  const data: DataType[] = listInboundRequest.map((item, index) => ({
    key: index.toString(),
    name: item.productName, // Bạn có thể thay đổi cách lấy tên sản phẩm từ API khác nếu có
    quantity: item.quantity,
    unitprice: item.unitPrice,
    totalprice: item.totalPrice,
  }));

  return <Table<DataType> columns={columns} dataSource={data} />;
};
export default ApprovalTableInboundRequest;