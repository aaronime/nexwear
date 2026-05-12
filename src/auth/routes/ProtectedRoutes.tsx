import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { UserRole } from "@/shop/interfaces/authResponse";

interface Props {
  children: React.ReactNode;
}

export const AuthenticatedRoute = ({ children }: Props) => {
  const authStatus = useAuthStore((state) => state.authStatus);

  if (authStatus === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
      </div>
    );
  }

  if (authStatus === "not-authenticated") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AdminRoute = ({ children }: Props) => {
  const authStatus = useAuthStore((state) => state.authStatus);
  const isAdminUser =
    useAuthStore((state) => state.user?.role) === UserRole.ADMIN;

  if (authStatus === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
      </div>
    );
  }

  if (authStatus === "not-authenticated") {
    return <Navigate to="/login" replace />;
  }

  if (!isAdminUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">
            Acceso Denegado
          </h2>
          <p className="mt-2 text-slate-600">
            No tienes permisos de administrador para acceder a esta página
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
