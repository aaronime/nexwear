import { tagsApi } from "@/api/nexwearApi";
import type { Tag } from "../interfaces/getAllTagsResponse";

export const updateTag = async (tagId: string, name?: string): Promise<Tag> => {
  const { data } = await tagsApi.put(`/${tagId}`, { name });
  return data;
};