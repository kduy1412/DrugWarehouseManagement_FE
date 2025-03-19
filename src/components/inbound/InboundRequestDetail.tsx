import React, { useState } from 'react';
import { Menu, Dropdown, Modal, Button, Form, Input, Row, Space, Divider, Col } from 'antd';
import type { MenuProps } from 'antd';

// Define the type for menu items
const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'Chỉnh sửa',
  },
  {
    key: '2',
    label: 'Chi tiết',
  },
];

const InboundRequestDetail: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string>('');
  const [form] = Form.useForm();
  const showModal = (content: string) => {
    setModalContent(content);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleMenuClick = (e: { key: string }) => {
    if (e.key === '1') {
      showModal('You clicked on "Chỉnh sửa"');
    } else if (e.key === '2') {
      showModal('You clicked on "Chi tiết"');
    }
  };
  const handleFormSubmit = (values: any) => {
    console.log('Form Values:', values);
    setIsModalVisible(false);
  };
  const menu = (
    <Menu onClick={handleMenuClick} items={items} />
  );

  return (
    <div>
      <Dropdown overlay={menu}>
        <Button>
          Open Menu
        </Button>
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
          <div style={{ padding: '0px' }}>
            <h3 style={{ textAlign: 'center' }}>Thông tin sản phẩm</h3>
            <Form layout="horizontal">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Tên sản phẩm" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Input placeholder="Enter value 1" />
                  </Form.Item>
                </Col>

                {/* Second Input */}
                <Col span={8}>
                  <Form.Item label="Đơn giá" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Input placeholder="Enter value 2" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Số lượng" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Input placeholder="Enter value 3" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <h3 style={{ textAlign: 'center' }}>Thông tin Nhà cung cấp</h3>
            <Form layout="horizontal">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Nhà cung cấp" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Input placeholder="Enter value 1" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Địa chỉ" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Input placeholder="Enter value 2" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Số điện thoại" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Input placeholder="Enter value 3" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Mã số thuế" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Input placeholder="Enter value 1" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Quốc gia" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Input placeholder="Enter value 2" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div style={{ textAlign: 'right' }}>
              <Space size="small">
                <Button type="primary" htmlType="submit">
                  Hoàn thành
                </Button>
              </Space>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default InboundRequestDetail;
