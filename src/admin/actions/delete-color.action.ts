import { colorsApi } from "@/api/nexwearApi";
import type { Color } from "../interfaces/getAllColorsResponse";

export const deleteColor = async (colorId: string): Promise<Color> => {
  const { data } = await colorsApi.delete(`/${colorId}`);
  return data;
};