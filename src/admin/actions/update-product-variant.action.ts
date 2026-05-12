import { productVariantsApi } from "@/api/nexwearApi";
import type { ProductVariant } from "../interfaces/productVariant";

export interface UpdateProductVariantParams {
  productVariantId: string;
  productId?: string;
  sku?: string;
  stock?: number;
  price?: number;
  colorId?: string;
  sizeId?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export const updateProductVariant = async ({
  productId,
  productVariantId,
  sku,
  stock,
  price,
  colorId,
  sizeId,
  isActive,
  isDeleted,
}: UpdateProductVariantParams): Promise<ProductVariant> => {
  const { data } = await productVariantsApi.put(`/${productVariantId}`, {
    productId,
    sku,
    stock,
    price,
    colorId,
    sizeId,
    isActive,
    isDeleted,
  });
  return data;
};
