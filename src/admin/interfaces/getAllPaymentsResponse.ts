import type { PaymentMethod, PaymentStatus } from "@/shop/interfaces/createPaymentResponse";

export interface GetAllPaymentsResponse {
    page: number;
    limit: number;
    total: number;
    pages: number;
    payments: Payment[];
  }
  
  export interface Payment {
    id: string;
    orderId: string;
    method: PaymentMethod;
    status: PaymentStatus;
    amount: number;
    transactionId: string;
  }