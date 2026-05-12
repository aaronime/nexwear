import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getUser } from "@/admin/actions/get-user.action";

export const adminUserQueryKey = (userId: string | undefined) =>
  ["admin-user", userId] as const;

export const useAdminUser = (userId: string | undefined, enabled: boolean) => {
  const authStatus = useAuthStore((s) => s.authStatus);

  return useQuery({
    queryKey: adminUserQueryKey(userId),
    queryFn: () => getUser(userId!),
    enabled: authStatus === "authenticated" && !!userId && enabled,
    staleTime: 0,
    retry: false,
  });
};
