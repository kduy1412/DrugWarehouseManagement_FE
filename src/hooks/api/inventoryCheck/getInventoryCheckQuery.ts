import { useQuery } from "@tanstack/react-query";
import {
  InventoryCheckGetRequestParams,
  InventoryCheckGetResponse,
} from "../../../types/inventoryCheck";
import { getInventoryCheck } from "../../../api/endpoints/inventoryCheck";

export const useGetInventoryCheckQuery = (
  query: InventoryCheckGetRequestParams
) =>
  useQuery<InventoryCheckGetResponse, Error, InventoryCheckGetResponse>({
    queryFn: () => getInventoryCheck(query),
    queryKey: ["inventoryCheck", query],
  });
