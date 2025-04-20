import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Trang này không tồn tại"
      extra={<CtaButton onClick={() => navigate("/home")}>Back Home</CtaButton>}
    />
  );
};

export default ErrorPage;

const CtaButton = styled(Button)`
  &:not(:disabled) {
    color: white !important;
  }
  border-color: transparent !important;
  background-color: var(--color-secondary-600);
  &:not(:disabled):hover {
    background-color: var(--color-secondary-500) !important;
  }
`;
