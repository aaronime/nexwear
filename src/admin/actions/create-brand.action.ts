import { brandsApi } from "@/api/nexwearApi";
import type { Brand } from "../interfaces/getAllBrandsResponse";

export const createBrand = async (
  name: string
): Promise<Brand> => {
  const { data } = await brandsApi.post("/", { name });
  return data;
};
