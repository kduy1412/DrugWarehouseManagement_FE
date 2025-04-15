import { Flex, Spin } from "antd";
import React from "react";
import styled from "styled-components";

const LoadingComponents = () => {
  return (
    <StyledFlex align="center" justify="center">
      <Spin size="large" />
    </StyledFlex>
  );
};

export default LoadingComponents;

const StyledFlex = styled(Flex)`
  width: 100%;
  height: 100%;
`;
