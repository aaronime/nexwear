import { Link, useNavigate } from "react-router";
import { LogOut, UserRound } from "lucide-react";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { useUserProfile } from "@/shop/hooks/useUserProfile";
import { Button } from "@/components/ui/button";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return `${first}${last}`.toUpperCase();
}

export const AccountProfileTab = () => {
  const sessionUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { profile, isLoading, isError, refetch } = useUserProfile();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (!sessionUser) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center">
        <UserRound
          className="mx-auto mb-4 h-14 w-14 text-slate-400"
          strokeWidth={1.25}
          aria-hidden
        />
        <h3 className="text-lg font-semibold text-slate-900">
          Inicia sesión para ver tu perfil
        </h3>
        <p className="mt-2 max-w-sm text-sm text-slate-600">
          Necesitas una cuenta para ver y gestionar tus datos.
        </p>
        <Button asChild className="mt-6" size="lg">
          <Link to="/login">Iniciar sesión</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center py-16">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"
          aria-hidden
        />
        <span className="sr-only">Cargando perfil</span>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50/40 px-6 py-12 text-center">
        <h3 className="text-lg font-semibold text-slate-900">
          No pudimos cargar tu perfil
        </h3>
        <p className="mt-2 max-w-sm text-sm text-slate-600">
          Revisa tu conexión e inténtalo de nuevo.
        </p>
        <Button className="mt-6" variant="outline" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  const initials = initialsFromName(profile.name);

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <div className="flex shrink-0 flex-col items-center gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-center">
        <div
          className="flex size-24 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-slate-800 to-slate-600 text-xl font-bold text-white ring-2 ring-slate-100 ring-offset-2 ring-offset-white"
          aria-hidden
        >
          {initials}
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-6">
        <dl className="grid gap-5 rounded-xl border border-slate-100 bg-slate-50/50 p-5 sm:gap-6 sm:p-6">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Nombre
            </dt>
            <dd className="mt-1 text-lg font-semibold text-slate-900">
              {profile.name}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Correo electrónico
            </dt>
            <dd className="mt-1 break-all text-sm font-medium text-slate-900">
              {profile.email}
            </dd>
          </div>
          <div className="border-t border-slate-100 pt-5 sm:col-span-2 sm:pt-6">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              ID de cuenta
            </dt>
            <dd className="mt-1 font-mono text-sm text-slate-800">{profile.id}</dd>
          </div>
        </dl>

        <div className="rounded-xl border border-slate-100 bg-white p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-slate-900">Sesión</h3>
          <p className="mt-1 text-sm text-slate-600">
            Cierra sesión en este dispositivo. Tendrás que volver a iniciar sesión
            para acceder a tu cuenta.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4 gap-2 border-slate-200 text-slate-800 hover:bg-red-50 hover:text-red-900"
            onClick={handleLogout}
          >
            <LogOut className="size-4" aria-hidden />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
};
