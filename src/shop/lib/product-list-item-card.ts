import type { ProductListItem } from "@/shop/interfaces/getProductsResonse";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600";

const NEW_PRODUCT_MS = 30 * 24 * 60 * 60 * 1000;

interface ProductCardFields {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  brand?: ProductListItem["brand"];
  imageUrl: string;
  isNew?: boolean;
  averageRating?: number;
  reviewCount?: number;
}

export function productListItemToCardProps(
  product: ProductListItem,
): ProductCardFields {
  const created = new Date(product.createdAt).getTime();
  const isNew = Number.isFinite(created) && Date.now() - created < NEW_PRODUCT_MS;

  return {
    id: product.id,
    name: product.name,
    price: product.finalPrice,
    originalPrice: product.discount ? product.price : undefined,
    discount: product.discount?.percentage,
    brand: product.brand,
    imageUrl: product.firstImage?.url ?? PLACEHOLDER_IMAGE,
    isNew,
    averageRating: product.averageRating,
    reviewCount: product.reviewCount,
  };
}
