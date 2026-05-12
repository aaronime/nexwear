import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getSize } from "@/admin/actions/get-size.action";

export const adminSizeQueryKey = (sizeId: string | undefined) =>
  ["admin-size", sizeId] as const;

export const useAdminSize = (sizeId: string | undefined, enabled: boolean) => {
  const authStatus = useAuthStore((state) => state.authStatus);

  return useQuery({
    queryKey: adminSizeQueryKey(sizeId),
    queryFn: () => getSize(sizeId!),
    enabled: authStatus === "authenticated" && !!sizeId && enabled,
    staleTime: 0,
    retry: false,
  });
};
