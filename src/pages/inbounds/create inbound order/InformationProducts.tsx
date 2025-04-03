import React, { useState } from "react";
import { Form, Table, Typography, Button, Modal, Input, Radio, Select, DatePicker } from "antd";
import moment from 'moment';

// Define types for your row data
interface Product {
  key: string;
  name: string;
  price: number;
}

interface Batch {
  key: string;
  batchId: string;
  product: string;
  quantity: number;
}

const InformationProduct: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Separate states for the modal form fields
  const [batchId, setBatchId] = useState("");
  const [productionDate, setProductionDate] = useState<moment.Moment | null>(null); // Changed to moment
  const [expiryDate, setExpiryDate] = useState<moment.Moment | null>(null); // Changed to moment
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");

  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null); // Track selected row

  // Example mock data for products and batches
  const productData: Product[] = [
    { key: "1", name: "Product 1", price: 100 },
    { key: "2", name: "Product 2", price: 150 },
  ];

  const warehouses = [
    { id: 'warehouse1', name: 'Nhà kho 1' },
    { id: 'warehouse2', name: 'Nhà kho 2' },
    { id: 'warehouse3', name: 'Nhà kho 3' }
  ];

  const batchData: Batch[] = [
    { key: "1", batchId: "B001", product: "Product 1", quantity: 10 },
    { key: "2", batchId: "B002", product: "Product 2", quantity: 20 },
  ];

  const productColumns = [
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Giá", dataIndex: "price", key: "price" },
  ];

  const batchColumns = [
    {
      title: "Chọn",
      render: (_: string, record: Batch) => (
        <Radio
          checked={selectedRowKey === record.key}
          onChange={() => setSelectedRowKey(record.key)}
        />
      ),
      key: "select",
    },
    { title: "Tên sản phẩm", dataIndex: "batchId", key: "batchId" },
    { title: "Số Lượng", dataIndex: "quantity", key: "quantity" },
  ];

  const handleCreateBatch = () => {
    setIsModalVisible(true); // Show modal when button is clicked
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Hide modal and reset form
    form.resetFields(); // Reset form fields
    setBatchId("");
    setProductionDate(null);
    setExpiryDate(null);
    setSelectedWarehouse("");
  };

  const handleOk = () => {
    // Here you can add logic to handle creating a new batch
    console.log("New batch created:", { batchId, productionDate, expiryDate, selectedWarehouse });
    setIsModalVisible(false); // Close the modal after creation
    form.resetFields(); // Reset form fields after submission
  };

  return (
    <Form form={form} layout="vertical">
      <Typography.Title level={4}>Danh sách sản phẩm</Typography.Title>
      <Button type="dashed" style={{ marginBottom: 10 }} onClick={handleCreateBatch}>
        Tạo lô Hàng
      </Button>
      <Table dataSource={batchData} columns={batchColumns} pagination={false} rowKey="key" />

      <Typography.Title level={4}>Danh sách lô hàng</Typography.Title>
      <Table dataSource={productData} columns={productColumns} pagination={false} rowKey="key" />

      {/* Modal for creating a new batch */}
      <Modal
        title="Tạo Lô Hàng Mới"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item label="Mã lô" required>
            <Input
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="Nhập mã lô"
            />
          </Form.Item>

          <Form.Item label="NSX (Ngày sản xuất)" required style={{ display: 'inline-block', width: '48%' }}>
            <DatePicker
              value={productionDate}
              onChange={(date) => setProductionDate(date)}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sản xuất"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item label="HSD (Hạn sử dụng)" required style={{ display: 'inline-block', width: '48%', marginLeft: '4%' }}>
            <DatePicker
              value={expiryDate}
              onChange={(date) => setExpiryDate(date)}
              format="DD/MM/YYYY"
              placeholder="Chọn hạn sử dụng"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="Chọn nhà kho" required>
            <Select
              value={selectedWarehouse}
              onChange={(value) => setSelectedWarehouse(value)}
              placeholder="Chọn nhà kho"
            >
              {warehouses.map((warehouse) => (
                <Select.Option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Form>
  );
};

export default InformationProduct;
