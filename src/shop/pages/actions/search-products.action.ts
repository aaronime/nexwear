import { productsApi } from "@/api/nexwearApi";
import type { ProductListItem } from "@/shop/interfaces/getProductsResonse";

interface SearchProductsResponse {
  products: ProductListItem[];
}

export const searchProducts = async (query: string): Promise<SearchProductsResponse> => {
  if (!query || query.trim().length < 2) {
    return { products: [] };
  }

  const params = new URLSearchParams();
  params.append("search", query);
  params.append("limit", "5");

  const { data } = await productsApi.get(`/?${params.toString()}`);

  return {
    products: data.products || [],
  };
};
