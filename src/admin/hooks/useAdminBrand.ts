import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getBrand } from "@/admin/actions/get-brand.action";

export const adminBrandQueryKey = (brandId: string | undefined) =>
  ["admin-brand", brandId] as const;

export const useAdminBrand = (brandId: string | undefined, enabled: boolean) => {
  const authStatus = useAuthStore((state) => state.authStatus);

  return useQuery({
    queryKey: adminBrandQueryKey(brandId),
    queryFn: () => getBrand(brandId!),
    enabled: authStatus === "authenticated" && !!brandId && enabled,
    staleTime: 0,
    retry: false,
  });
};
