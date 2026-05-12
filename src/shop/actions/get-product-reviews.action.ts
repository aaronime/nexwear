import { reviewsApi } from "@/api/nexwearApi";
import type { GetReviewsResponse } from "@/shop/interfaces/productReviewsResponse";

export const getProductReviews = async (
  productId: string,
): Promise<GetReviewsResponse> => {
  const { data } = await reviewsApi.get(`/product/${productId}`);
  return data;
};
