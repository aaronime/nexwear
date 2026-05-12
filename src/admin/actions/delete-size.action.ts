import { sizesApi } from "@/api/nexwearApi";
import type { Size } from "../interfaces/getAllSizesResponse";

export const deleteSize = async (sizeId: string): Promise<Size> => {
  const { data } = await sizesApi.delete(`/${sizeId}`);
  return data;
};
