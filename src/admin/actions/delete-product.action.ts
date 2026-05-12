import { productsApi } from "@/api/nexwearApi";
import type { Product } from "../interfaces/getAllProductsResponse";

export const deleteProduct = async (productId: string): Promise<Product> => {
  const { data } = await productsApi.delete(`/${productId}`);
  return data;
};