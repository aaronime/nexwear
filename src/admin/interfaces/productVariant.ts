export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  stock: number;
  soldCount: number;
  isActive: boolean;
  isDeleted: boolean;
  colorId: string;
  sizeId: string;
  price: number;
}
