import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getMaterial } from "@/admin/actions/get-material.action";

export const adminMaterialQueryKey = (materialId: string | undefined) =>
  ["admin-material", materialId] as const;

export const useAdminMaterial = (
  materialId: string | undefined,
  enabled: boolean,
) => {
  const authStatus = useAuthStore((state) => state.authStatus);

  return useQuery({
    queryKey: adminMaterialQueryKey(materialId),
    queryFn: () => getMaterial(materialId!),
    enabled: authStatus === "authenticated" && !!materialId && enabled,
    staleTime: 0,
    retry: false,
  });
};
