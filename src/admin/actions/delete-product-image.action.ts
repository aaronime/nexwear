import { productImagesApi } from "@/api/nexwearApi";
import type { ProductImage } from "../interfaces/getAllProductsResponse";

export const deleteProductImage = async (productImageId: string): Promise<ProductImage> => {
  const { data } = await productImagesApi.delete(`/${productImageId}`);
  return data;
};
