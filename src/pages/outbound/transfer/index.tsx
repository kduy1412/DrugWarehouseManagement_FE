import { Card, Tabs, TabsProps } from "antd";
import React, { useCallback, useState } from "react";
import { Pill } from "@phosphor-icons/react";
import styled from "styled-components";
import ProductInformationStep from "./components/ProductInformationStep";
import { LotTransferPostRequest } from "../../../types/outbound";
import WarehouseInformationStep from "./components/WarehouseInformationStep";
import images from "../../../assets";

const TransferLotPage = () => {
  const [currentStep, setCurrentStep] = useState("1");
  const [formData, setFormData] = useState<LotTransferPostRequest>({
    lotTransferCode: "",
    fromWareHouseId: null,
    toWareHouseId: null,
    lotTransferDetails: [],
  });

  const onChange = (key: string) => {
    setCurrentStep(key);
  };

  const handleFormUpdate = useCallback(
    (stepData: Partial<LotTransferPostRequest>) => {
      setFormData((prev) => ({ ...prev, ...stepData }));
    },
    []
  );

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Chọn điểm đến",
      icon: React.createElement(images.warehouse),
      children: (
        <WarehouseInformationStep
          formData={formData}
          updateFormData={handleFormUpdate}
          onNext={() => setCurrentStep("2")}
        />
      ),
    },
    {
      key: "2",
      label: "Lựa Chọn Mặt Hàng",
      icon: <Pill size={18} />,
      children: (
        <ProductInformationStep
          formData={formData}
          updateFormData={handleFormUpdate}
        />
      ),
    },
  ];

  return (
    <Card>
      <StyledTabs activeKey={currentStep} items={items} onChange={onChange} />
    </Card>
  );
};

export default TransferLotPage;

const StyledTabs = styled(Tabs)`
  max-width: 100%;
  margin: 0 auto;

  & .ant-tabs-tab:hover {
    color: var(--color-secondary-600) !important;
  }

  & .ant-tabs-tab {
    font-weight: var(--font-weight-medium);
  }

  & .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: var(--color-secondary-600) !important;
    svg path {
      fill: var(--color-secondary-600) !important;
    }
  }

  & .ant-tabs-tab-btn {
    display: flex !important;
  }

  & .ant-tabs-tab-icon {
    display: flex;
    width: fit-content;
    align-items: center;
  }

  & .ant-tabs-ink-bar {
    background-color: var(--color-secondary-600);
  }
`;
