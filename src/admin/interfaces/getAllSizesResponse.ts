export interface GetAllSizesResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
  sizes: Size[];
}

export interface Size {
  id: string;
  name: string;
}
