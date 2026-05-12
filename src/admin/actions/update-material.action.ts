import { materialsApi } from "@/api/nexwearApi";
import type { Material } from "../interfaces/getAllMaterialsResponse";

export const updateMaterial = async (
  materialId: string,
  name?: string,
): Promise<Material> => {
  const { data } = await materialsApi.put(`/${materialId}`, { name });
  return data;
};
