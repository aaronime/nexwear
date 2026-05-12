import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/shop/pages/actions/get-products.action";
import type { ProductListItem } from "@/shop/interfaces/getProductsResonse";

const FETCH_LIMIT = "36";

export const useHomeTrendingProducts = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["home", "products", "trending-preview"],
    queryFn: () =>
      getProducts({
        limit: FETCH_LIMIT,
        page: "1",
      }),
    staleTime: 1000 * 60 * 5,
  });

  const products = useMemo(() => {
    const list: ProductListItem[] = data?.products ?? [];
    if (list.length === 0) return [];
    return [...list]
      .sort((a, b) => b.soldCount - a.soldCount || b.averageRating - a.averageRating)
      .slice(0, 6);
  }, [data?.products]);

  return {
    products,
    isLoading,
    isError,
  };
};
