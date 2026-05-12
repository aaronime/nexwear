import { tagsApi } from "@/api/nexwearApi";
import type { Tag } from "../interfaces/getAllTagsResponse";

export const createTag = async (name: string): Promise<Tag> => {
  const { data } = await tagsApi.post("/", { name });
  return data;
};
