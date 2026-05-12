import { useQuery } from "@tanstack/react-query";
import { getProductReviews } from "@/shop/actions/get-product-reviews.action";

export const useProductReviews = (productId: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => getProductReviews(productId),
    staleTime: 1000 * 60 * 2,
    enabled: !!productId,
  });

  const visibleReviews = data?.reviews.filter((r) => r.isVisible) ?? [];

  return {
    page: data?.page ?? 1,
    limit: data?.limit ?? 0,
    total: data?.total ?? 0,
    pages: data?.pages ?? 0,
    reviews: visibleReviews,
    isLoading,
    isError,
    error,
  };
};
