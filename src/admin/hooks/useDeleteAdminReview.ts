import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "@/admin/actions/delete-review.action";

export const useDeleteAdminReview = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "product-reviews", productId],
      });
    },
  });
};
