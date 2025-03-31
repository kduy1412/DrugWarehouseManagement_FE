import { useQuery } from "@tanstack/react-query";
import { cleanFilterParams } from "../../../utils/cleanNullOrEmpty";
import {
  WarehouseGetRequestParams,
  WarehouseGetResponse,
} from "../../../types/warehouse";
import { searchWarehouse } from "../../../api/endpoints/warehouse";

export const useGetWarehouseQuery = (params: WarehouseGetRequestParams) => {
  const clearedParams = cleanFilterParams(params) as WarehouseGetRequestParams;
  return useQuery<WarehouseGetResponse, Error, WarehouseGetResponse>({
    queryKey: ["warehouse", clearedParams],
    queryFn: () => searchWarehouse(clearedParams),
  });
};
