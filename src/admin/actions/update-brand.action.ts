import { brandsApi } from "@/api/nexwearApi";
import type { Brand } from "../interfaces/getAllBrandsResponse";

export const updateBrand = async (brandId: string, name?: string): Promise<Brand> => {
    const { data } = await brandsApi.put(`/${brandId}`, { name });
    return data;
}