export interface PaymentResponse {
    id: string;
    orderId: string;
    method: PaymentMethod;
    status: PaymentStatus;
    amount: number;
    transactionId: string;
  }
  
  export type PaymentMethod =
    | 'CREDIT_CARD'
    | 'DEBIT_CARD'
    | 'PAYPAL'
    | 'BANK_TRANSFER';
  
  export type PaymentStatus =
    | 'PENDING'
    | 'COMPLETED'
    | 'FAILED'
    | 'REFUNDED';