import { reviewsApi } from "@/api/nexwearApi";
import type { Review } from "@/shop/interfaces/productReviewsResponse";

export const getReviewById = async (reviewId: string): Promise<Review> => {
  const { data } = await reviewsApi.get<Review>(`/${reviewId}`);
  return data;
};
