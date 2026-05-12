import { create } from "zustand";

export interface CheckoutState {
  selectedAddressId: string | null;
  selectedPaymentMethodId: string | null;

  setSelectedAddressId: (id: string | null) => void;
  setSelectedPaymentMethodId: (id: string | null) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  selectedAddressId: null,
  selectedPaymentMethodId: null,

  setSelectedAddressId: (id) => set({ selectedAddressId: id }),

  setSelectedPaymentMethodId: (id) => set({ selectedPaymentMethodId: id }),

  resetCheckout: () => set({ selectedAddressId: null, selectedPaymentMethodId: null }),
}));
