import { reviewsApi } from "@/api/nexwearApi";
import type { Review } from "@/shop/interfaces/productReviewsResponse";

export interface CreateReviewBody {
  userId: string;
  productId: string;
  score: number;
  comment: string;
  isVisible: boolean;
}

export const createReview = async (body: CreateReviewBody): Promise<Review> => {
  const { data } = await reviewsApi.post<Review>("/", body);
  return data;
};
