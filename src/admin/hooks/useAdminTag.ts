import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getTag } from "@/admin/actions/get-tag.action";

export const adminTagQueryKey = (tagId: string | undefined) =>
  ["admin-tag", tagId] as const;

export const useAdminTag = (tagId: string | undefined, enabled: boolean) => {
  const authStatus = useAuthStore((state) => state.authStatus);

  return useQuery({
    queryKey: adminTagQueryKey(tagId),
    queryFn: () => getTag(tagId!),
    enabled: authStatus === "authenticated" && !!tagId && enabled,
    staleTime: 0,
    retry: false,
  });
};
