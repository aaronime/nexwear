import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getColor } from "@/admin/actions/get-color.action";

export const adminColorQueryKey = (colorId: string | undefined) =>
  ["admin-color", colorId] as const;

export const useAdminColor = (
  colorId: string | undefined,
  enabled: boolean,
) => {
  const authStatus = useAuthStore((state) => state.authStatus);

  return useQuery({
    queryKey: adminColorQueryKey(colorId),
    queryFn: () => getColor(colorId!),
    enabled:
      authStatus === "authenticated" && !!colorId && enabled,
    staleTime: 0,
    retry: false,
  });
};
