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

const data: DataType[] = [
  {
    key: '1',
    name: 'A',
    quantity: 32,
    unitprice: 1000,
    totalprice: 1000,
  },
];

const ApprovalTableInboundRequest: React.FC = () => <Table<DataType> columns={columns} dataSource={data} />;

export default ApprovalTableInboundRequest;