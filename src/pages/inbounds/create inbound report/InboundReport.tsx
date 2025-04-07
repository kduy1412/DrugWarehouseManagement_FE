import React from 'react';
import {  Table} from 'antd';
import { title } from 'process';

const InboundReport: React.FC = () => {


  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];

  const columns = [
    {title:"Mã lô"},
    {title:"Tên SP"},
    {title:"NSX"},
    {title:"HSD"},
    {title:"Số lượng"},
    {title:"Giá thành"},
    {title:"Tổng tiền"},
  ];

  return (
    <Table dataSource={dataSource} columns={columns} />
  );
};

export default InboundReport;