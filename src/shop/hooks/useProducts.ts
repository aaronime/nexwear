import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../pages/actions/get-products.action";

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

export const useProducts = (filters: ProductFiltersParams = {}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    staleTime: 1000 * 60 * 5,
  });

  return {
    products: data?.products || [],
    pagination: {
      page: data?.page || 1,
      limit: data?.limit || 10,
      total: data?.total || 0,
      pages: data?.pages || 1,
    },
    productFilters: data?.productFilters || {
      brands: [],
      categories: [],
      discounts: [],
      colors: [],
      sizes: [],
      tags: [],
      materials: [],
      minPrice: 0,
      maxPrice: 0,
    },
    filters: data?.filters,
    isLoading,
    isError,
    error,
  };
};
