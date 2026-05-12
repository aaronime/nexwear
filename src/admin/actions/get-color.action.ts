import { colorsApi } from "@/api/nexwearApi";
import type { Color } from "../interfaces/getAllColorsResponse";

export const getColor = async (colorId: string): Promise<Color> => {
  const { data } = await colorsApi.get(`/${colorId}`);
  return data;
};
