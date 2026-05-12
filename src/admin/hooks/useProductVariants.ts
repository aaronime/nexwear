import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getAllProductVariants } from "@/admin/actions/get-all-product-variants.action";

export const productVariantsQueryKey = (productId: string | undefined) =>
  ["product-variants", productId] as const;

export const useProductVariants = (productId: string | undefined) => {
  const authStatus = useAuthStore((s) => s.authStatus);

  return useQuery({
    queryKey: productVariantsQueryKey(productId),
    queryFn: () => getAllProductVariants(productId!),
    enabled: authStatus === "authenticated" && !!productId,
    staleTime: 1000 * 30,
  });
};
