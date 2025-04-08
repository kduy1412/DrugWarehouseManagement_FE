import React from 'react';
import {  Table} from 'antd';
import { title } from 'process';
import { InboundDetail } from '../../../types/inbound';
import moment from 'moment';

interface InboundReportProps {
  record: {
    lo: InboundDetail[];
  };
}

const InboundReport: React.FC<InboundReportProps> = ({record}) => {



const columns = [
  { title: "Mã lô", dataIndex: "lotNumber" },
  { title: "Tên SP", dataIndex: "productName" },
  {
    title: "NSX",
    dataIndex: "manufacturingDate",
    render: (date: string) => moment(date).format("DD/MM/YYYY"),
  },
  {
    title: "HSD",
    dataIndex: "expiryDate",
    render: (date: string) => moment(date).format("DD/MM/YYYY"),
  },
  { title: "Số lượng", dataIndex: "quantity" },
  { title: "Giá thành", dataIndex: "unitPrice" },
  { title: "Tổng tiền", dataIndex: "totalPrice" },
];

  return (
    <Table dataSource={record.lo} columns={columns} rowKey={"inboundId"}/>
  );
};

export default InboundReport;