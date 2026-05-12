import { brandsApi } from "@/api/nexwearApi";
import type { GetAllBrandsResponse } from "../interfaces/getAllBrandsResponse";

export interface GetAllBrandsParams {
  page?: number;
  limit?: number;
}

export const getAllBrands = async (
  params?: GetAllBrandsParams,
): Promise<GetAllBrandsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page != null && params.page > 0) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null && params.limit > 0) {
    searchParams.set("limit", String(params.limit));
  }
  const query = searchParams.toString();
  const path = query ? `/?${query}` : "/";
  const { data } = await brandsApi.get(path);
  return data;
};
