import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReview,
  type CreateReviewBody,
} from "@/shop/actions/create-review.action";

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body: CreateReviewBody) => createReview(body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-reviews", variables.productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
    },
  });

  return {
    createReview: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
