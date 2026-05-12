export interface SavedPaymentMethodMock {
  id: string;
  brand: "Visa" | "Mastercard" | "Amex";
  last4: string;
  holderName: string;
  expiryLabel: string;
  isDefault: boolean;
}
