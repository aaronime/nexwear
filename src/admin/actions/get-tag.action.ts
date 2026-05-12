import { tagsApi } from "@/api/nexwearApi";
import type { Tag } from "../interfaces/getAllTagsResponse";

export const getTag = async (tagId: string): Promise<Tag> => {
  const { data } = await tagsApi.get(`/${tagId}`);
  return data;
};
