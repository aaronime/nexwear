import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { getUser } from "../actions/get-user.action";

export const useUserProfile = () => {
  const user = useAuthStore((state) => state.user);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: () => getUser(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  return {
    profile: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
