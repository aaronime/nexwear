import { materialsApi } from "@/api/nexwearApi";
import type { Material } from "../interfaces/getAllMaterialsResponse";

export const getMaterial = async (materialId: string): Promise<Material> => {
  const { data } = await materialsApi.get(`/${materialId}`);
  return data;
};
