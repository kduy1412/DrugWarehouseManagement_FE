import React, { useState } from 'react';
import { Tabs, Button, Space, Form, Input, Select, Typography } from 'antd';
import type { TabsProps } from 'antd';
import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import InformationProduct from './InformationProducts';

// Declare the interface outside of the component
interface CreateInboundProps {
  record: {
    maphieu: string;
  };
}

const CreateInbound: React.FC<CreateInboundProps> = ({ record }) => {
  const [activeTab, setActiveTab] = useState<string>('1');

  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

  // Sample data for the "Tên khách hàng" search options (replace with your actual data)
  const customerNames = [
    { id: '1', name: 'Nguyễn Văn A' },
    { id: '2', name: 'Trần Thị B' },
    { id: '3', name: 'Lê Minh C' },
    // Add more customer names as needed
  ];

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <>
          <AppstoreOutlined /> Thông tin đơn hàng
        </>
      ),
      children: <div>
        <Form layout="vertical" >
          <Typography.Title level={3}>Thông tin đơn hàng</Typography.Title>
          
          <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true, message: "Vui lòng chọn tên khách hàng" }]}>
            <Select
              showSearch
              placeholder="Chọn NCC"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              {customerNames.map((customer) => (
                <Select.Option key={customer.id} value={customer.name}>
                  {customer.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
            <Input placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item name="address" label="MST" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
            <Input placeholder="MST" />
          </Form.Item>

          {/* Use the maphieu from the record */}
          <Form.Item name="requestid" label="Mã phiếu" rules={[{ required: true, message: "Vui lòng nhập mã đặt hàng" }]}>
            <Input placeholder={record.maphieu} disabled />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Ghi chú đơn hàng (nếu có)" />
          </Form.Item>
        </Form>
      </div>,
    },
    {
      key: '2',
      label: (
        <>
          <SettingOutlined /> Chi tiết sản phẩm
        </>
      ),
      children: <div><InformationProduct /></div>,
    },
  ];

  const nextTab = () => {
    const nextKey = (parseInt(activeTab) + 1).toString();
    if (items.find((tab) => tab.key === nextKey)) {
      setActiveTab(nextKey);
    }
  };

  const prevTab = () => {
    const prevKey = (parseInt(activeTab) - 1).toString();
    if (items.find((tab) => tab.key === prevKey)) {
      setActiveTab(prevKey);
    }
  };

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={onTabChange} items={items} />
      <Space style={{ marginTop: 16 }}>
        <Button onClick={prevTab} disabled={activeTab === '1'}>
          Previous
        </Button>
        <Button onClick={nextTab} disabled={activeTab === items.length.toString()}>
          Next
        </Button>
      </Space>
    </div>
  );
};

export default CreateInbound;
