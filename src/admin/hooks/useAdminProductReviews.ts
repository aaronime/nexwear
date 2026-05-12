import { useQuery } from "@tanstack/react-query";
import { getReviewsByProductId } from "@/admin/actions/get-reviews-by-product-id.action";

export const useAdminProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ["admin", "product-reviews", productId],
    queryFn: () => getReviewsByProductId(productId),
    enabled: !!productId,
    staleTime: 1000 * 60,
  });
};
