import { useQuery } from "@tanstack/react-query";
import {
  getAllPayments,
  type GetAllPaymentsParams,
} from "@/admin/actions/get-all-payments.action";

export const ADMIN_PAYMENTS_PAGE_SIZE = 20;

export const adminPaymentsQueryKey = (params: GetAllPaymentsParams) =>
  [
    "admin-payments",
    params.page ?? 1,
    params.limit ?? ADMIN_PAYMENTS_PAGE_SIZE,
  ] as const;

export const useAdminPayments = (params: GetAllPaymentsParams = {}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? ADMIN_PAYMENTS_PAGE_SIZE;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: adminPaymentsQueryKey({ page, limit }),
    queryFn: () => getAllPayments({ page, limit }),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });

  return {
    payments: data?.payments ?? [],
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
