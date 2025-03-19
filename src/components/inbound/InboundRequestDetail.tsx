import React, { useState } from "react";
import {
  Menu,
  Dropdown,
  Modal,
  Button,
  Form,
  Input,
  Row,
  Table,
  Col,
  Divider,
} from "antd";
import type { MenuProps } from "antd";
import type { TableColumnsType } from "antd";
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const InboundRequestDetail: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [form] = Form.useForm();
  const showModal = (content: string) => {
    setModalContent(content);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleMenuClick = (e: { key: string }) => {
    if (e.key === "1") {
      showModal('You clicked on "Chỉnh sửa"');
    } else if (e.key === "2") {
      showModal('You clicked on "Chi tiết"');
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = (values: any) => {
    console.log("Form Values:", values);
    setIsModalVisible(false);
  };
  const menu = <Menu onClick={handleMenuClick} items={items} />;
  const data: DataType[] = [];
  const columns: TableColumnsType<DataType> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "ten",
    },
    {
      title: "Mã số lô",
      dataIndex: "masolo",
    },
    {
      title: "HSD",
      dataIndex: "hsd",
    },
    {
      title: "Đơn vị tính",
      dataIndex: "donvitinh",
    },
    {
      title: "Số lượng",
      dataIndex: "soluong",
    },
    {
      title: "Đơn giá nhập",
      dataIndex: "dongia",
    },
    {
      title: "Thành tiền",
      dataIndex: "thanhtien",
    },
  ];

  return (
    <div>
      <Dropdown overlay={menu}>
        <Button>Open Menu</Button>
      </Dropdown>
      <Modal
        title="Action"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <p>{modalContent}</p>
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <div style={{ padding: "0px" }}>
            <Divider>
              <h3 style={{ textAlign: "center" }}>Thông tin phiếu đặt hàng</h3>
            </Divider>
            <Form layout="horizontal">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Tên sản phẩm"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input placeholder="Enter value 1" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Đơn giá"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input placeholder="Enter value 2" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Số lượng"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input placeholder="Enter value 3" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Divider>
              <h3 style={{ textAlign: "center" }}>Thông tin Nhà cung cấp</h3>
            </Divider>
            <Form layout="horizontal">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Nhà cung cấp"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input placeholder="Enter value 1" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Địa chỉ"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input placeholder="Enter value 2" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Số điện thoại"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input placeholder="Enter value 3" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Mã số thuế"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input placeholder="Enter value 1" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Quốc gia"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input placeholder="Enter value 2" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Divider>
              <h3 style={{ textAlign: "center" }}>Thông tin mặt hàng</h3>
            </Divider>
            <Table<DataType>
              columns={columns}
              dataSource={data}
              size="middle"
              pagination={{ pageSize: 50 }}
              scroll={{ y: 55 * 5 }}
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default InboundRequestDetail;
