import { tagsApi } from "@/api/nexwearApi";
import type { GetAllTagsResponse } from "../interfaces/getAllTagsResponse";

export interface GetAllTagsParams {
  page?: number;
  limit?: number;
}

export const getAllTags = async (
  params?: GetAllTagsParams,
): Promise<GetAllTagsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page != null && params.page > 0) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null && params.limit > 0) {
    searchParams.set("limit", String(params.limit));
  }
  const query = searchParams.toString();
  const path = query ? `/?${query}` : "/";
  const { data } = await tagsApi.get(path);
  return data;
};
