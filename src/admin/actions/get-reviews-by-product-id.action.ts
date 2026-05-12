import { reviewsApi } from "@/api/nexwearApi";
import type { GetReviewsResponse } from "@/shop/interfaces/productReviewsResponse";

export const getReviewsByProductId = async (
  productId: string,
): Promise<GetReviewsResponse> => {
  const { data } = await reviewsApi.get<GetReviewsResponse>(
    `/product/${productId}`,
  );
  return data;
};
