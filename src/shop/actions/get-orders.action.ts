import { ordersApi } from "@/api/nexwearApi";
import type { GetOrdersResponse } from "../interfaces/getOrdersResonse";

export interface GetOrdersParams {
  page?: number;
  limit?: number;
}

export const getOrders = async (
  userId: string,
  params?: GetOrdersParams,
): Promise<GetOrdersResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.page != null && params.page > 0) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null && params.limit > 0) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();
  const path = query ? `/user/${userId}?${query}` : `/user/${userId}`;
  const { data } = await ordersApi.get(path);

  return data;
};
