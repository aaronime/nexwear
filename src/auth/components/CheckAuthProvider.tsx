import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";

interface Props {
  children: React.ReactNode;
}

export const CheckAuthProvider = ({ children }: Props) => {
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  const { isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: checkAuthStatus,
    retry: false,
    refetchInterval: 1000 * 60 * 1.5,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
