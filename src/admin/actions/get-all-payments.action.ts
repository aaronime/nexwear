import { paymentsApi } from "@/api/nexwearApi";
import type { GetAllPaymentsResponse } from "../interfaces/getAllPaymentsResponse";

export interface GetAllPaymentsParams {
  page?: number;
  limit?: number;
}

export const getAllPayments = async (
  params?: GetAllPaymentsParams,
): Promise<GetAllPaymentsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page != null && params.page > 0) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null && params.limit > 0) {
    searchParams.set("limit", String(params.limit));
  }
  const query = searchParams.toString();
  const path = query ? `/?${query}` : "/";
  const { data } = await paymentsApi.get(path);
  return data;
};
