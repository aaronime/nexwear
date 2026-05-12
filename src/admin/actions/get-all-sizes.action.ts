import { sizesApi } from "@/api/nexwearApi";
import type { GetAllSizesResponse } from "../interfaces/getAllSizesResponse";

export interface GetAllSizesParams {
  page?: number;
  limit?: number;
}

export const getAllSizes = async (
  params?: GetAllSizesParams,
): Promise<GetAllSizesResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page != null && params.page > 0) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null && params.limit > 0) {
    searchParams.set("limit", String(params.limit));
  }
  const query = searchParams.toString();
  const path = query ? `/?${query}` : "/";
  const { data } = await sizesApi.get(path);
  return data;
};
