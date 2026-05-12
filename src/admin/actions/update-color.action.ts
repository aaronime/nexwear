import { colorsApi } from "@/api/nexwearApi";
import type { Color } from "../interfaces/getAllColorsResponse";

export interface UpdateColorParams {
    colorId?: string;
    name?: string;
    hex?: string;
}

export const updateColor = async (params: UpdateColorParams): Promise<Color> => {
    const { colorId, name, hex } = params;
    const { data } = await colorsApi.put(`/${colorId}`, { name, hex });
    return data;
}