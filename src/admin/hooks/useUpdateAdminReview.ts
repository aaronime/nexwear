import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateReview,
  type UpdateReviewBody,
} from "@/admin/actions/update-review.action";

export const useUpdateAdminReview = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      body,
    }: {
      reviewId: string;
      body: UpdateReviewBody;
    }) => updateReview(reviewId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "product-reviews", productId],
      });
    },
  });
};
