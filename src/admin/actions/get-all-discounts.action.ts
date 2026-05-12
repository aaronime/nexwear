import { discountsApi } from "@/api/nexwearApi";
import type { GetAllDiscountsResponse } from "../interfaces/getAllDiscountsResponse";

export interface GetAllDiscountsParams {
  page?: number;
  limit?: number;
}

export const getAllDiscounts = async (
  params?: GetAllDiscountsParams,
): Promise<GetAllDiscountsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page != null && params.page > 0) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null && params.limit > 0) {
    searchParams.set("limit", String(params.limit));
  }
  const query = searchParams.toString();
  const path = query ? `/?${query}` : "/";
  const { data } = await discountsApi.get(path);
  return data;
};
