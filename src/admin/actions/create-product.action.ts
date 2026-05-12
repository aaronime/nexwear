import { productsApi } from "@/api/nexwearApi";
import type { Product } from "../interfaces/getAllProductsResponse";

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  brandId: string;
  categoryId: string;
  discountId?: string;
  tagIds: string[];
  materialIds: string[];
  isActive?: boolean;
}

export const createProduct = async ({
  name,
  description,
  price,
  brandId,
  categoryId,
  discountId,
  tagIds,
  materialIds,
  isActive,
}: CreateProductPayload): Promise<Product> => {
  const body: Record<string, unknown> = {
    name,
    description,
    price,
    brandId,
    categoryId,
    discountId,
    tagIds,
    materialIds,
  };
  if (isActive !== undefined) body.isActive = isActive;
  const { data } = await productsApi.post("/", body);
  return data;
};
