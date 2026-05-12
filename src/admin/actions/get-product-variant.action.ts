import { productVariantsApi } from "@/api/nexwearApi";
import type { ProductVariant } from "../interfaces/productVariant";

export const getProductVariant = async (
  productVariantId: string,
): Promise<ProductVariant> => {
  const { data } = await productVariantsApi.get(`/${productVariantId}`);
  return data;
};
