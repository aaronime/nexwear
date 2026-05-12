import { sizesApi } from "@/api/nexwearApi";
import type { Size } from "../interfaces/getAllSizesResponse";

export const getSize = async (sizeId: string): Promise<Size> => {
  const { data } = await sizesApi.get(`/${sizeId}`);
  return data;
};
