import { productsApi } from "@/api/nexwearApi";
import type { GetProductsResponse } from "@/shop/interfaces/getProductsResonse";

interface ProductFiltersParams {
  search?: string;
  categoryId?: string;
  brandId?: string;
  colorId?: string;
  sizeId?: string;
  materialId?: string;
  tagId?: string;
  discountId?: string;
  gender?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  sortBy?: string;
  page?: string;
  limit?: string;
}

export const getProducts = async (filters: ProductFiltersParams = {}): Promise<GetProductsResponse> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  const { data } = await productsApi.get(`/?${params.toString()}`);

  return data;
}