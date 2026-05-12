import { reviewsApi } from "@/api/nexwearApi";

export const deleteReview = async (reviewId: string): Promise<void> => {
  await reviewsApi.delete(`/${reviewId}`);
};
