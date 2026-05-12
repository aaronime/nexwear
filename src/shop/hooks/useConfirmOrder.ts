import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrderAction } from "@/shop/actions/create-order.action";
import { createPaymentAction } from "@/shop/actions/create-payment.action";
import { updatePaymentStatus } from "@/shop/actions/update-payment-status.action";
import type { PaymentMethod } from "@/shop/interfaces/createPaymentResponse";
import type { SavedPaymentMethodMock } from "@/shop/interfaces/saved-payment-method.interface";
import type { CartItem } from "@/shop/interfaces/getCartResponse";
import { clearCartItemsAction } from "../actions/clear-cart-items.action";

interface ConfirmOrderVariables {
  userId: string;
  addressId: string;
  items: CartItem[];
  paymentMethod: SavedPaymentMethodMock;
  totalAmount: number;
  cartId: string;
  tax: number;
  shipping: number;
  discount: number;
}

const DEFAULT_PAYMENT_STATUS = "COMPLETED" as const;

function mapSavedMethodToPaymentMethod(
  brand: SavedPaymentMethodMock["brand"]
): PaymentMethod {
  // Mock solo expone marcas de tarjeta; el backend usa métodos genéricos.
  switch (brand) {
    case "Visa":
    case "Mastercard":
    case "Amex":
    default:
      return "CREDIT_CARD";
  }
}

export const useConfirmOrder = () => {

  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async ({
      userId,
      addressId,
      items,
      paymentMethod,
      totalAmount,
      cartId,
      tax,
      shipping,
      discount,
    }: ConfirmOrderVariables) => {
      console.log({totalAmount})
      const order = await createOrderAction({
        tax,
        shipping,
        discount,
        userId,
        addressId,
        items: items.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        })),
      });

      const payment = await createPaymentAction({
        orderId: order.id,
        method: mapSavedMethodToPaymentMethod(paymentMethod.brand),
        amount: totalAmount,
        transactionId: `nexwear-${crypto.randomUUID()}`,
      });

      await updatePaymentStatus(payment.id, DEFAULT_PAYMENT_STATUS);

      await clearCartItemsAction(cartId);
      
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });

      return { orderId: order.id };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
    },
  });

  return {
    confirmOrder: mutation.mutateAsync,
    isConfirming: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
