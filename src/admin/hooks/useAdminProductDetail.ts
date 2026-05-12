import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getProduct } from "@/admin/actions/get-product.action";

export const adminProductDetailQueryKey = (productId: string | undefined) =>
  ["admin-product-detail", productId] as const;

export const useAdminProductDetail = (productId: string | undefined) => {
  const authStatus = useAuthStore((s) => s.authStatus);

  return useQuery({
    queryKey: adminProductDetailQueryKey(productId),
    queryFn: () => getProduct(productId!),
    enabled: authStatus === "authenticated" && !!productId,
    staleTime: 1000 * 30,
  });
};
