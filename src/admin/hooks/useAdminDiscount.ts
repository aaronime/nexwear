import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getDiscount } from "@/admin/actions/get-discount.action";

export const adminDiscountQueryKey = (discountId: string | undefined) =>
  ["admin-discount", discountId] as const;

export const useAdminDiscount = (
  discountId: string | undefined,
  enabled: boolean,
) => {
  const authStatus = useAuthStore((state) => state.authStatus);

  return useQuery({
    queryKey: adminDiscountQueryKey(discountId),
    queryFn: () => getDiscount(discountId!),
    enabled: authStatus === "authenticated" && !!discountId && enabled,
    staleTime: 0,
    retry: false,
  });
};
