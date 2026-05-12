import { brandsApi } from "@/api/nexwearApi";
import type { Brand } from "../interfaces/getAllBrandsResponse";

export const getBrand = async (brandId: string): Promise<Brand> => {
  const { data } = await brandsApi.get(`/${brandId}`);
  return data;
};
