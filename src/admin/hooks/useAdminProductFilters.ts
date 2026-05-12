import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getAllProducts } from "@/admin/actions/get-all-products.action";
import type { ProductFilters } from "@/admin/interfaces/getAllProductsResponse";

export const adminProductFiltersQueryKey = ["admin-product-filters"] as const;

export const useAdminProductFilters = () => {
  const authStatus = useAuthStore((s) => s.authStatus);

  return useQuery({
    queryKey: adminProductFiltersQueryKey,
    queryFn: async (): Promise<ProductFilters> => {
      const res = await getAllProducts({ page: 1, limit: 1 });
      return res.productFilters;
    },
    enabled: authStatus === "authenticated",
    staleTime: 1000 * 60 * 5,
  });
};
