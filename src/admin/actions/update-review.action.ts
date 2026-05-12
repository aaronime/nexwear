import { reviewsApi } from "@/api/nexwearApi";
import type { Review } from "@/shop/interfaces/productReviewsResponse";

export interface UpdateReviewBody {
  productId: string;
  score: number;
  comment: string;
  isVisible: boolean;
}

export const updateReview = async (
  reviewId: string,
  body: UpdateReviewBody,
): Promise<Review> => {
  const { data } = await reviewsApi.put<Review>(`/${reviewId}`, body);
  return data;
};
