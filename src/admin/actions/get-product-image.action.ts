import { productImagesApi } from "@/api/nexwearApi";
import type { ProductImage } from "../interfaces/getAllProductsResponse";

export const getProductImage = async (productImageId: string): Promise<ProductImage> => {
  const { data } = await productImagesApi.get(`/${productImageId}`);
  return data;
};
