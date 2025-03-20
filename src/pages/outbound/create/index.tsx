import { Button, Tabs, TabsProps } from "antd";
import { useState } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import { Pill } from "@phosphor-icons/react";
import styled from "styled-components";
import CustomerInformationStep from "./CustomerInformationStep";
import ProductInformationStep from "./ProductInformationStep";
import { OutboundPostRequest } from "../../../types/outbound";

const CreateOutboundPage = () => {
  const [currentStep, setCurrentStep] = useState("1");
  const [formData, setFormData] = useState<OutboundPostRequest>({
    customerId: null,
    customerName: "",
    address: "",
    phoneNumber: "",
    outboundOrderCode: "",
    trackingNumber: "",
    note: "",
    outboundDetails: [],
  });

  const onChange = (key: string) => {
    setCurrentStep(key);
  };

  const handleFormUpdate = (stepData: Partial<OutboundPostRequest>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const handleSubmit = () => {
    console.log("Final form data:", formData);
  };

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
    <div>
      <StyledTabs activeKey={currentStep} items={items} onChange={onChange} />
      {currentStep === "2" && (
        <CtaButton
          type="primary"
          onClick={handleSubmit}
          style={{ marginTop: 16 }}
        >
          Hoàn tất
        </CtaButton>
      )}
    </div>
  );
};

export default CreateOutboundPage;

const StyledTabs = styled(Tabs)`
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

const CtaButton = styled(Button)`
  background-color: var(--color-secondary-600);
  &:hover {
    background-color: var(--color-secondary-500) !important;
  }
`;
