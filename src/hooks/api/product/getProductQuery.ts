import { useQuery } from "@tanstack/react-query";
import {
  ProductGetRequestParams,
  ProductGetResponse,
} from "../../../types/product";
import { searchProduct } from "../../../api/endpoints/product";
import { cleanFilterParams } from "../../../utils/cleanNullOrEmpty";

export const useGetProductQuery = (params: ProductGetRequestParams) => {
  const clearedParams = cleanFilterParams(params) as ProductGetRequestParams;
  return useQuery<ProductGetResponse, Error, ProductGetResponse>({
    queryKey: ["product", clearedParams],
    queryFn: () => searchProduct(clearedParams),
  });
};
