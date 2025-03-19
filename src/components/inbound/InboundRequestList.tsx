import React from "react";
import { Table, Space, Dropdown } from "antd";
import type { TableColumnsType } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}
const items: MenuProps["items"] = [
  {
    key: "1",
    label: "Chỉnh sửa",
  },
  {
    key: "2",
    label: "Chi tiết",
  },
];
const columns: TableColumnsType<DataType> = [
  {
    title: "Mã phiếu",
    dataIndex: "maphieu",
  },
  {
    title: "NCC",
    dataIndex: "ncc",
  },
  {
    title: "Loại hàng",
    dataIndex: "loaihang",
  },
  {
    title: "Ngày nhập",
    dataIndex: "ngaynhap",
  },
  {
    title: "Người tạo",
    dataIndex: "nguoitao",
  },
  {
    title: "Tổng tiền",
    dataIndex: "tongtien",
  },
  {
    title: "Trạng thái",
    dataIndex: "trangthai",
  },
  {
    title: "Action",
    key: "action",
    sorter: true,
    render: () => (
      <Dropdown menu={{ items }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Thao tác
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
];
const InboundRequestList: React.FC = () => (
  <>
    <Table<DataType>
      columns={columns}
      dataSource={data}
      size="middle"
      pagination={{ pageSize: 50 }}
      scroll={{ y: 55 * 5 }}
    />
  </>
);

export default InboundRequestList;
