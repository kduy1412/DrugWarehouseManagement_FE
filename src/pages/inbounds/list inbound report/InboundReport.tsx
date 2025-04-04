import React from 'react';
import { Divider, Table } from 'antd';
import type { TableColumnsType } from 'antd';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
    {
        title: 'Mã lô',
      },
      {
        title: 'Tên sản phẩm',
      },
      {
        title: 'NSX',
      },
      {
        title: 'HSD',
      },
      {
        title: 'Vị trí kho',
      },
      {
        title: 'Số lượng',
  
      },
      {
        title: 'Số thực',
        dataIndex: 'sothuc',
      },
];

const data: DataType[] = [
  
];

const InboundReport: React.FC = () => (
  <>
    <Table<DataType> columns={columns} dataSource={data}  />
  </>
);

export default InboundReport;