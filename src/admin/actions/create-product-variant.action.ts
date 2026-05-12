import { productVariantsApi } from "@/api/nexwearApi";
import type { ProductVariant } from "../interfaces/productVariant";

export interface CreateProductVariantPayload {
  productId: string;
  sku: string;
  stock: number;
  price: number;
  colorId: string;
  sizeId: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export const createProductVariant = async ({
  productId,
  sku,
  stock,
  price,
  colorId,
  sizeId,
  isActive,
  isDeleted,
}: CreateProductVariantPayload): Promise<ProductVariant> => {
  const body: Record<string, unknown> = {
    productId,
    sku,
    stock,
    price,
    colorId,
    sizeId,
  };
  if (isActive !== undefined) body.isActive = isActive;
  if (isDeleted !== undefined) body.isDeleted = isDeleted;
  const { data } = await productVariantsApi.post("/", body);
  return data;
};
