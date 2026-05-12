import { materialsApi } from "@/api/nexwearApi";
import type { Material } from "../interfaces/getAllMaterialsResponse";

export const createMaterial = async (name: string): Promise<Material> => {
  const { data } = await materialsApi.post("/", { name });
  return data;
};
