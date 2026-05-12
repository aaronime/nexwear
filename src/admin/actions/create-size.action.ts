import { sizesApi } from "@/api/nexwearApi";
import type { Size } from "../interfaces/getAllSizesResponse";

export const createSize = async (name: string): Promise<Size> => {
  const { data } = await sizesApi.post("/", { name });
  return data;
};
