import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getProductVariant } from "@/admin/actions/get-product-variant.action";

export const adminProductVariantQueryKey = (id: string | undefined) =>
  ["admin-product-variant", id] as const;

export const useAdminProductVariant = (
  variantId: string | undefined,
  enabled: boolean,
) => {
  const authStatus = useAuthStore((s) => s.authStatus);

  return useQuery({
    queryKey: adminProductVariantQueryKey(variantId),
    queryFn: () => getProductVariant(variantId!),
    enabled: authStatus === "authenticated" && !!variantId && enabled,
    staleTime: 0,
    retry: false,
  });
};
