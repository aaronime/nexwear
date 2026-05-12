import { tagsApi } from "@/api/nexwearApi";
import type { Tag } from "../interfaces/getAllTagsResponse";

export const deleteTag = async (tagId: string): Promise<Tag> => {
  const { data } = await tagsApi.delete(`/${tagId}`);
  return data;
};
