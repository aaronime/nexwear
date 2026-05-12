import { productsApi } from "@/api/nexwearApi";
import type { Product } from "../interfaces/getAllProductsResponse";

export interface UpdateProductParams {
  productId: string;
  name?: string;
  description?: string;
  price?: number;
  brandId?: string;
  categoryId?: string;
  discountId?: string;
  tagIds?: string[];
  materialIds?: string[];
  isActive?: boolean;
  isDeleted?: boolean;
}

export const updateProduct = async ({
  productId,
  name,
  description,
  price,
  brandId,
  categoryId,
  discountId,
  tagIds,
  materialIds,
  isActive,
  isDeleted,
}: UpdateProductParams): Promise<Product> => {
  const { data } = await productsApi.put(`/${productId}`, {
    name,
    description,
    price,
    brandId,
    categoryId,
    discountId,
    tagIds,
    materialIds,
    isActive,
    isDeleted,
  });
  return data;
};
