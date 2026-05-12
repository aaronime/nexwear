import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCartItem } from "@/auth/actions/create-cart-item.action";
import { updateCartItemQuantity } from "@/shop/actions/update-cart-item-quantity.action";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { useCart } from "./useCart";
import { toast } from "sonner";

interface AddToCartProps {
  productVariantId: string;
  quantity: number;
}

type AddToCartResult =
  | { action: "created" }
  | { action: "updated"; capped: boolean };

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const { cart } = useCart();

  const mutation = useMutation({
    mutationFn: async ({
      productVariantId,
      quantity,
    }: AddToCartProps): Promise<AddToCartResult> => {
      if (!cart?.id) {
        throw new Error("No se encontró el carrito");
      }

      const existing = cart.items.find(
        (item) => item.productVariantId === productVariantId
      );

      if (existing) {
        const stock = existing.productVariant?.stock ?? Number.POSITIVE_INFINITY;
        const requested = Math.max(1, quantity);
        const newQuantity = Math.min(requested, stock);
        const capped = requested > newQuantity;

        if (newQuantity < 1) {
          throw new Error("No hay más unidades disponibles de esta variante");
        }

        await updateCartItemQuantity(existing.id, newQuantity);
        return {
          action: "updated",
          capped,
        };
      }

      await createCartItem({
        cartId: cart.id,
        productVariantId,
        quantity,
      });
      return { action: "created" };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
      if (result.action === "updated") {
        toast.success(
          result.capped
            ? "Cantidad actualizada (límite de stock alcanzado)"
            : "Cantidad actualizada en el carrito"
        );
      } else {
        toast.success("Producto agregado al carrito");
      }
    },
    onError: (error: Error) => {
      if (error.message === "No hay más unidades disponibles de esta variante") {
        toast.info(error.message);
      }
    },
  });

  return {
    addToCart: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};
