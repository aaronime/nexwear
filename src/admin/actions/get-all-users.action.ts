import { usersApi } from "@/api/nexwearApi";
import type { GetAllUsersResponse } from "../interfaces/getAllUsersResponse";

export interface GetAllUsersParams {
  page?: number;
  limit?: number;
}

export const getAllUsers = async (
  params?: GetAllUsersParams,
): Promise<GetAllUsersResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page != null && params.page > 0) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null && params.limit > 0) {
    searchParams.set("limit", String(params.limit));
  }
  const query = searchParams.toString();
  const path = query ? `/?${query}` : "/";
  const { data } = await usersApi.get(path);
  return data;
};
