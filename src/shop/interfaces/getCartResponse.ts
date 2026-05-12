export interface GetCartResponse {
    id: string;
    userId: string;
    items: CartItem[];
  }
  
  export interface CartItem {
    id: string;
    cartId: string;
    productVariantId: string;
    quantity: number;
    productName: string;
    productVariant: ProductVariant;
  }
  
  export interface ProductVariant {
    id: string;
    productId: string;
    sku: string;
    stock: number;
    colorId: string;
    sizeId: string;
    price: number;
    image: string;
    color: string;
    size: string;
  }