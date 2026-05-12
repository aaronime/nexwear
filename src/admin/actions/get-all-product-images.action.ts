import { productImagesApi } from "@/api/nexwearApi";
import type { ProductImage } from "../interfaces/getAllProductsResponse";

export const getAllProductImages = async (productId: string): Promise<ProductImage[]> => {

  const { data } = await productImagesApi.get(`/product/${productId}`);
  return data;
};
