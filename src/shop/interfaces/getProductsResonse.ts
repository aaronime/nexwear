export interface GetProductsResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
  products: ProductListItem[];
  productFilters: ProductFilters;
  filters: SelectedFilters;
}

export interface ProductListItem {
  id: string;
  name: string;
  description: string;
  price: number;
  finalPrice: number;
  gender: Gender;
  averageRating: number;
  reviewCount: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
  brand?: Brand;
  category?: Category;
  discount?: Discount;
  firstImage?: ProductImage;
}

export interface ProductFilters {
  brands: Brand[];
  categories: Category[];
  discounts: Discount[];
  colors: Color[];
  sizes: Size[];
  tags: Tag[];
  materials: Material[];
  minPrice: number;
  maxPrice: number;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Discount {
  id: string;
  name: string;
  percentage: number;
  startDate: string;
  endDate: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  order: number;
}

export interface Color {
  id: string;
  name: string;
  hex: string;
}

export interface Size {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Material {
  id: string;
  name: string;
}

export const Gender = {
  MEN: "MEN",
  WOMEN: "WOMEN",
  UNISEX: "UNISEX",
  KIDS: "KIDS",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export interface SelectedFilters {
  brand?: Brand;
  category?: Category;
  color?: Color;
  size?: Size;
  material?: Material;
  tag?: Tag;
  discount?: Discount;
  minPrice?: number;
  maxPrice?: number;
  gender?: Gender;
  inStock?: boolean;
  search?: string;
}