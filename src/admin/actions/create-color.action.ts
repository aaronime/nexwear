import { colorsApi } from "@/api/nexwearApi";
import type { Color } from "../interfaces/getAllColorsResponse";

export interface CreateColorPayload {
  name: string;
  hex: string;
}

export const createColor = async ({
  name,
  hex,
}: CreateColorPayload): Promise<Color> => {
  const { data } = await colorsApi.post("/", { name, hex });
  return data;
};
