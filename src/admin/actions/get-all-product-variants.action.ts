import { productVariantsApi } from "@/api/nexwearApi";
import type { ProductVariant } from "../interfaces/productVariant";

export const getAllProductVariants = async (productId: string): Promise<ProductVariant[]> => {

  const { data } = await productVariantsApi.get(`/product/${productId}`);
  return data;
};
