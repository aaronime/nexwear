import { materialsApi } from "@/api/nexwearApi";
import type { GetAllMaterialsResponse } from "../interfaces/getAllMaterialsResponse";

export interface GetAllMaterialsParams {
  page?: number;
  limit?: number;
}

export const getAllMaterials = async (
  params?: GetAllMaterialsParams,
): Promise<GetAllMaterialsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page != null && params.page > 0) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null && params.limit > 0) {
    searchParams.set("limit", String(params.limit));
  }
  const query = searchParams.toString();
  const path = query ? `/?${query}` : "/";
  const { data } = await materialsApi.get(path);
  return data;
};
