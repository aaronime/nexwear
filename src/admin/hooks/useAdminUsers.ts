import { useQuery } from "@tanstack/react-query";
import {
  getAllUsers,
  type GetAllUsersParams,
} from "@/admin/actions/get-all-users.action";

export const ADMIN_USERS_PAGE_SIZE = 20;

export const adminUsersQueryKey = (params: GetAllUsersParams) =>
  [
    "admin-users",
    params.page ?? 1,
    params.limit ?? ADMIN_USERS_PAGE_SIZE,
  ] as const;

export const useAdminUsers = (params: GetAllUsersParams = {}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? ADMIN_USERS_PAGE_SIZE;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: adminUsersQueryKey({ page, limit }),
    queryFn: () => getAllUsers({ page, limit }),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });

  return {
    users: data?.users ?? [],
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
