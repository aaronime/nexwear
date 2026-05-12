import { ordersApi } from "@/api/nexwearApi";
import type { GetAllOrdersResponse } from "../interfaces/getAllOrdersResponse";

export interface GetAllOrdersParams {
  page?: number;
  limit?: number;
}

export const getAllOrders = async (
  params?: GetAllOrdersParams,
): Promise<GetAllOrdersResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page != null && params.page > 0) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null && params.limit > 0) {
    searchParams.set("limit", String(params.limit));
  }
  const query = searchParams.toString();
  const path = query ? `/?${query}` : "/";
  const { data } = await ordersApi.get(path);
  return data;
};
