import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSuggestedProducts } from "@/shop/actions/get-suggested-products";
import type { ProductListItem } from "@/shop/interfaces/getProductsResonse";

export const useSuggestedProducts = (excludeProductId: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", "suggested", excludeProductId],
    queryFn: () => getSuggestedProducts({ limit: "6" }),
    staleTime: 1000 * 60 * 2,
    enabled: !!excludeProductId,
  });

  const products: ProductListItem[] = useMemo(() => {
    const list = data?.products ?? [];
    return list.filter((p) => p.id !== excludeProductId);
  }, [data?.products, excludeProductId]);

  return {
    products,
    isLoading,
    isError,
  };
};
