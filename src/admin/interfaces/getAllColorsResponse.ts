export interface GetAllColorsResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
  colors: Color[];
}

export interface Color {
  id: string;
  name: string;
  hex: string;
}
