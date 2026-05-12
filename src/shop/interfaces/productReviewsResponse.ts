export interface GetReviewsResponse {
    page: number;
    limit: number;
    total: number;
    pages: number;
    reviews: Review[];
  }
  
  export interface Review {
    id: string;
    userId: string;
    productId: string;
    score: number;
    comment: string;
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
  }