import React, { useState } from "react";
import { Form, Table, Typography, Button, Modal, Input, Radio } from "antd";

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
  const [batchId, setBatchId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null); // Track selected row

  // Example mock data for products and batches
  const productData: Product[] = [
    { key: "1", name: "Product 1", price: 100 },
    { key: "2", name: "Product 2", price: 150 },
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
    { title: "Ten san pham", dataIndex: "batchId", key: "batchId" },
    { title: "So Luong", dataIndex: "quantity", key: "quantity" },
  ];

  const handleCreateBatch = () => {
    setIsModalVisible(true); // Show modal when button is clicked
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Hide modal
  };

  const handleOk = () => {
    // Here you can add logic to handle creating a new batch
    console.log("New batch created:", { batchId, quantity });
    setIsModalVisible(false); // Close the modal after creation
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
          <Form.Item label="NSX" required>
            <Input
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="Ngày sản xuất"
            />
          </Form.Item>
          <Form.Item label="HSD" required>
            <Input
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="Hạn sử dụng "
            />
          </Form.Item>
          <Form.Item label="Số lượng" required>
            <Input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Nhập số lượng"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Form>
  );
};

export default InformationProduct;
