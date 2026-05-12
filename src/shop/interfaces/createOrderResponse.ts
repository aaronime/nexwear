export interface OrderResponse {
    id: string;
    userId: string;
    addressId: string;
    total: number;
    status: OrderStatus;
    createdAt: Date;
  }
  
  export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';