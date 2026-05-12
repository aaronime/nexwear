export interface GetAllDiscountsResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
  discounts: Discount[];
}

export interface Discount {
  id: string;
  name: string;
  percentage: number;
  startDate: string;
  endDate: string;
}
