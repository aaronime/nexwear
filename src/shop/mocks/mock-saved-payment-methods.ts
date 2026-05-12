import type { SavedPaymentMethodMock } from "@/shop/interfaces/saved-payment-method.interface";

export const MOCK_SAVED_PAYMENT_METHODS: SavedPaymentMethodMock[] = [
  {
    id: "pm-mock-visa-1",
    brand: "Visa",
    last4: "4242",
    holderName: "Carlos Rivera",
    expiryLabel: "12 / 2027",
    isDefault: true,
  },
  {
    id: "pm-mock-master-1",
    brand: "Mastercard",
    last4: "8821",
    holderName: "Carlos Rivera",
    expiryLabel: "03 / 2026",
    isDefault: false,
  },
  {
    id: "pm-mock-amex-1",
    brand: "Amex",
    last4: "1006",
    holderName: "María Elena Gómez",
    expiryLabel: "09 / 2028",
    isDefault: false,
  },
];

export const PAYMENT_METHOD_BRAND_BADGE_CLASS: Record<
  SavedPaymentMethodMock["brand"],
  string
> = {
  Visa: "bg-[#1434CB] text-white",
  Mastercard: "bg-slate-900 text-white",
  Amex: "bg-[#006FCF] text-white",
};
