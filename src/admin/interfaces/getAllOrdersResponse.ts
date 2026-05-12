import type { OrderStatus } from "../../shop/interfaces/createOrderResponse";
import type { PaymentMethod, PaymentStatus } from "../../shop/interfaces/createPaymentResponse";

export interface GetAllOrdersResponse {
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
  
    payment: Payment;
    items: OrderItem[];
  }
  
  export interface Payment {
    id: string;
    orderId: string;
    method: PaymentMethod;
    status: PaymentStatus;
    amount: number;
    transactionId: string;
  }
  
  export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    productVariantId: string;
    imageUrl: string;
    colorName: string;
    sizeName: string;
    productName: string;
    quantity: number;
    price: number;
  }