import type { OrderStatus } from "./createOrderResponse";
import type { PaymentMethod, PaymentStatus } from "./createPaymentResponse";

export interface GetOrdersResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
  orders: Order[];
}

export interface Order {
  id: string;
  userId: string;
  
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  subtotal: number;
  tax: number;
  discount: number;
  shipping: number;
  total: number;

  status: OrderStatus;
  createdAt: string;

  items: OrderItem[];
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  orderId: string;

  productId?: string;
  productVariantId?: string;

  imageUrl: string;
  colorName: string;
  sizeName: string;
  productName: string;

  quantity: number;
  price: number;
}

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transactionId?: string;
}