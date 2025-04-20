// HomePage.tsx
import { Segmented } from "antd";
import {
  DashboardGetRequestFilterParams,
  DashBoardGetResponse,
} from "../types/dashboard";
import DashboardPage from "./dashboard";
import styled from "styled-components";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashBoardReport } from "../api/endpoints/dashboard";
import LoadingComponents from "../components/LoadingComponents";

const HomePage = () => {
  const [selectedType, setSelectedType] =
    useState<DashboardGetRequestFilterParams>("Day");

  const { data, isPending } = useQuery({
    queryFn: () => getDashBoardReport({ filter: selectedType }),
    queryKey: ["dashboard", selectedType],
  });

  if (isPending) return <LoadingComponents />;

  return (
    <Container>
      <Segmented<string>
        options={[
          { label: "Ngày", value: "Day" },
          { label: "Tuần", value: "Week" },
          { label: "Tháng", value: "Month" },
          { label: "Năm", value: "Year" },
        ]}
        onChange={(value) => {
          setSelectedType(value as DashboardGetRequestFilterParams);
        }}
        value={selectedType}
      />
      {data && <DashboardPage data={data} />}
    </Container>
  );
};

export default HomePage;

const Container = styled.div`
  padding: 16px;
  background-color: #f7fafc;
  min-height: 100vh;
`;
