import { Card, Tabs, TabsProps } from "antd";
import { useCallback, useState } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import { Pill } from "@phosphor-icons/react";
import styled from "styled-components";
import { SampleExportRequest } from "../../../types/outbound";
import CustomerInformationStep from "./components/CustomerInformationStep";
import ProductInformationStep from "./components/ProductInformationStep";

const SampleExportPage = () => {
  const [currentStep, setCurrentStep] = useState("1");
  const [formData, setFormData] = useState<SampleExportRequest>({
    customerId: null,
    receiverName: "",
    receiverAddress: "",
    receiverPhone: "",
    outboundOrderCode: "",
    note: "",
    outboundDetails: [],
  });

  const onChange = (key: string) => {
    setCurrentStep(key);
  };

  const handleFormUpdate = useCallback(
    (stepData: Partial<SampleExportRequest>) => {
      setFormData((prev) => ({ ...prev, ...stepData }));
    },
    []
  );

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Thông Tin Khách Hàng",
      icon: <UserAddOutlined />,
      children: (
        <CustomerInformationStep
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

export default SampleExportPage;

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
