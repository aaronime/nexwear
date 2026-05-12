import type { Gender } from "./getProductsResonse";

export interface GetProductResponse {
    id: string;
    name: string;
    description: string;
    price: number;
    gender: Gender;
    createdAt: string;
    updatedAt: string;

    averageRating?: number;
    reviewCount?: number;
    soldCount?: number;
    reviews?: ProductReview[];
  
    brand?: Brand;
    category?: Category;
    discount?: Discount;

    isActive?: boolean;
    isDeleted?: boolean;

    tags: Tag[];
    colors: Color[];
    sizes: Size[];
  
    images: ProductImage[];
    variants: ProductVariant[];
    materials: Material[];
  }

export interface ProductReview {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    userName?: string;
    user?: ProductReviewAuthor;
    verifiedPurchase?: boolean;
}

export interface ProductReviewAuthor {
    fullName?: string;
    firstName?: string;
    lastName?: string;
}
  
  export interface Brand {
    id: string;
    name: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    parentId?: string;
  }
  
  export interface Discount {
    id: string;
    name: string;
    percentage: number;
    startDate: string;
    endDate: string;
  }
  
  export interface Tag {
    id: string;
    name: string;
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
  
  export interface ProductImage {
    id: string;
    productId: string;
    url: string;
    order: number;
  }
  
  export interface ProductVariant {
    id: string;
    productId: string;
    sku: string;
    stock: number;
    colorId?: string;
    sizeId?: string;
    price?: number;
    soldCount?: number;
    isActive?: boolean;
    isDeleted?: boolean;
  }
  
  export interface Material {
    id: string;
    name: string;
  }