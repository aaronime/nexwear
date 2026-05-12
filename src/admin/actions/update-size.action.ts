import { sizesApi } from "@/api/nexwearApi";
import type { Size } from "../interfaces/getAllSizesResponse";

export const updateSize = async (
  sizeId: string,
  name?: string
): Promise<Size> => {
  const { data } = await sizesApi.put(`/${sizeId}`, { name });
  return data;
};
