import { productsApi } from "@/api/nexwearApi";
import type { GetProductResponse } from "@/shop/interfaces/getProductResponse";

export const getProduct = async (
  productId: string,
): Promise<GetProductResponse> => {
  const { data } = await productsApi.get(`/${productId}`);
  return data;
};
