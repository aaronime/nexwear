import { materialsApi } from "@/api/nexwearApi";
import type { Material } from "../interfaces/getAllMaterialsResponse";

export const deleteMaterial = async (materialId: string): Promise<Material> => {
  const { data } = await materialsApi.delete(`/${materialId}`);
  return data;
};