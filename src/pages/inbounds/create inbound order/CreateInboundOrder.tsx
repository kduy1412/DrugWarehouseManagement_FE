import React, { useEffect, useState } from 'react';
import { Tabs, Button, Space, Form, Input, Select, Typography } from 'antd';
import type { TabsProps } from 'antd';
import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import InformationProduct from './InformationProducts';
import { CustomerGetRequestParams, CustomerGetResponse } from '../../../types/customer';
import { InboundRequestDetail } from '../../../types/inboundRequest';
import { useGetWarehouseQuery } from '../../../hooks/api/warehouse/getWarehouseQuery';
import { useCreateInboundMutation } from '../../../hooks/api/inbound/createInboundMutation';
import { useGetProviderQuery } from '../../../hooks/api/provider/getProviderQuery';

// Declare the interface outside of the component
interface CreateInboundProps {
  record: {
    key: number;
    maphieu: string;
    sanpham: InboundRequestDetail[];
  };
  onClose: () => void;
}

interface Batch {
  key: string;
  lotNumber: string;
  productId: number;
  manufacturingDate: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}


const initialData: CustomerGetRequestParams = {
  Page: 1,
  PageSize: 100,
};

const CreateInbound: React.FC<CreateInboundProps> = ({ record, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [form] = Form.useForm();

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const { mutate, isSuccess } = useCreateInboundMutation();
  
  //call API
  const { data } = useGetProviderQuery(initialData);
  const dataWarehouse = useGetWarehouseQuery(initialData)

  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("is success: ", isSuccess);
    form.resetFields();
    setBatches([]);
    setSelectedWarehouse("");
    onClose();
  }
}, [isSuccess]);

 useEffect(() => {
      console.log("Dữ liệu batches:", batches);
  }, [batches]);

const handleSubmit = async () => {
  try {
    const values = await form.validateFields();
    mutate({
      providerOrderCode: values.providerOrderCode || '',
      note: values.note || '',
      providerId: values.providerId, 
      warehouseId: Number(selectedWarehouse),
      inboundRequestId: Number(record.key),
      inboundDetails: batches,
    }
    );

    // const tempData = {
    //   providerOrderCode: values.providerOrderCode || '',
    //   note: values.note || '',
    //   providerId: values.providerId, 
    //   warehouseId: Number(selectedWarehouse),
    //   inboundRequestId:  Number(record.key),
    //   inboundDetails: batches,
    // }
    // console.log("Dữ liệu tempData:", tempData);

  } catch (error) {
    console.log("Lỗi validate form:", error);
  }
};

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <>
          <AppstoreOutlined /> Thông tin đơn hàng
        </>
      ),
      children: <div>
        <Form layout="vertical" form={form}>
          <Typography.Title level={3}>Thông tin đơn hàng</Typography.Title>
          
          <Form.Item name="providerId" label="Tên khách hàng" rules={[{ required: true, message: "Vui lòng chọn tên khách hàng" }]}>
            <Select
              showSearch
              placeholder="Chọn Nhà cung cấp"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              {data?.items.map((provider) => (
                <Select.Option key={provider.providerId} value={provider.providerId}>
                  {provider.providerName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="providerOrderCode" label="Mã đơn hàng nhà cung cấp" rules={[{ required: true, message: "Vui lòng nhập mã số thuế" }]} >
            <Input placeholder="Nhập mã đơn hàng nhà cung cấp" />
          </Form.Item>

          {/* <Form.Item name="inboundRequestId" label="Mã phiếu" rules={[{ required: true, message: "Vui lòng nhập mã đặt hàng" }]}>
            <Input placeholder={record.maphieu} value={record.maphieu} disabled />
          </Form.Item> */}
          <Form.Item label="Mã phiếu">
            <Input value={record.maphieu} disabled />
          </Form.Item>
          <Form.Item label="Chọn nhà kho" required>
            <Select
              value={selectedWarehouse}
              onChange={(value) => setSelectedWarehouse(value)}
              placeholder="Chọn nhà kho"
            >
              {dataWarehouse.data?.items.map((warehouse) => (
                <Select.Option key={warehouse.warehouseId} value={warehouse.warehouseId}>
                  {warehouse.warehouseName}
                </Select.Option>
              ))}
            </Select>
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
      children: <div><InformationProduct productList={record.sanpham} onBatchChange={(newBatches) => setBatches(newBatches)} /></div>,
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
        <Button onClick={handleSubmit} type="primary" >
          Tạo
        </Button>
      </Space>
    </div>
  );
};

export default CreateInbound;
