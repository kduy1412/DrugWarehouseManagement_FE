import React, { useState } from 'react';
import { Tabs, Button, Space } from 'antd';
import type { TabsProps } from 'antd';
import { AppstoreOutlined, SettingOutlined} from '@ant-design/icons';
import OrderForm from './InformationInbound';
import InformationProduct from './InformationProducts';

const CreateInbound: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('1');

  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <>
          <AppstoreOutlined /> Thông tin đơn hàng
        </>
      ),
      children: <div><OrderForm/></div>,
    },
    {
      key: '2',
      label: (
        <>
          <SettingOutlined /> Chi tiết sản phẩm
        </>
      ),
      children: <div><InformationProduct/></div>,
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
