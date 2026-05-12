import { useQuery } from "@tanstack/react-query";
import { getCart } from "../actions/get-cart.action";
import { useAuthStore } from "@/auth/store/useAuthStore";

export const useCart = () => {
  const user = useAuthStore((state) => state.user);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: () => getCart(user?.id || ""),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  const subtotal = data?.items.reduce((acc, item) => {
    const unitPrice = item.productVariant.price;
    return acc + item.quantity * unitPrice;
  }, 0);

  const subtotalSafe = subtotal ?? 0;
  /** Envío $100 si hay productos y el subtotal es ≤ $100; gratis si subtotal > $100 */
  const shipping =
    subtotalSafe > 0 ? (subtotalSafe > 100 ? 0 : 100) : 0;
  const tax = subtotalSafe * 0.16;
  const total = subtotalSafe + shipping + tax;

  return {
    cartId: data?.id,
    cart: data,
    items: data?.items.sort((a, b) => a.productVariant.sku.localeCompare(b.productVariant.sku)) || [],
    subtotal: subtotalSafe,
    shipping,
    tax,
    total,
    isLoading,
    isError,
    error,
    refetch,
  };
};
