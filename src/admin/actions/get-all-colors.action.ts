import { colorsApi } from "@/api/nexwearApi";
import type { GetAllColorsResponse } from "../interfaces/getAllColorsResponse";

export interface GetAllColorsParams {
  page?: number;
  limit?: number;
}

export const getAllColors = async (
  params?: GetAllColorsParams,
): Promise<GetAllColorsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page != null && params.page > 0) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null && params.limit > 0) {
    searchParams.set("limit", String(params.limit));
  }
  const query = searchParams.toString();
  const path = query ? `/?${query}` : "/";
  const { data } = await colorsApi.get(path);
  return data;
};
