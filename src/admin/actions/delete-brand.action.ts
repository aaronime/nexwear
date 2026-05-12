import { brandsApi } from "@/api/nexwearApi";
import type { Brand } from "../interfaces/getAllBrandsResponse";

export const deleteBrand = async (brandId: string): Promise<Brand> => {
  const { data } = await brandsApi.delete(`/${brandId}`);
  return data;
};