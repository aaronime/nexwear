import { useQuery } from "@tanstack/react-query";
import {
  getAllMaterials,
  type GetAllMaterialsParams,
} from "@/admin/actions/get-all-materials.action";

export const ADMIN_MATERIALS_PAGE_SIZE = 20;

export const adminMaterialsQueryKey = (params: GetAllMaterialsParams) =>
  [
    "admin-materials",
    params.page ?? 1,
    params.limit ?? ADMIN_MATERIALS_PAGE_SIZE,
  ] as const;

export const useAdminMaterials = (
  params: GetAllMaterialsParams = {},
) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? ADMIN_MATERIALS_PAGE_SIZE;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: adminMaterialsQueryKey({ page, limit }),
    queryFn: () => getAllMaterials({ page, limit }),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });

  return {
    materials: data?.materials ?? [],
    page: data?.page ?? page,
    limit: data?.limit ?? limit,
    total: data?.total ?? 0,
    pages: data?.pages ?? 1,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
