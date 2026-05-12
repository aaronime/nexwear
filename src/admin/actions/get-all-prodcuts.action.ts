import { productsApi } from '@/api/nexwearApi';


import type { GetAllProductsResponse } from "../interfaces/getAllProductsResponse";

export interface GetAllProductsParams {
  page?: number;
  limit?: number;
}

export const getAllProducts = async (
  params?: GetAllProductsParams,
): Promise<GetAllProductsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page != null && params.page > 0) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null && params.limit > 0) {
    searchParams.set("limit", String(params.limit));
  }
  const query = searchParams.toString();
  const path = query ? `/?${query}` : "/";
  const { data } = await productsApi.get(path);
  return data;
};
