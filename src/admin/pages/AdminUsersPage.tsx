import { useState } from "react";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import type { User } from "@/admin/interfaces/getAllUsersResponse";
import {
  ADMIN_USERS_PAGE_SIZE,
  useAdminUsers,
} from "@/admin/hooks/useAdminUsers";
import { useUpdateUser } from "@/admin/hooks/useUpdateUser";
import { AdminUserFormModal } from "@/admin/components/AdminUserFormModal";
import { TablePagination } from "@/components/custom/TablePagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatOrderDate } from "@/shop/lib/order-display";
import { useAuthStore } from "@/auth/store/useAuthStore";

const USER_ROLE_LABEL: Record<User["role"], string> = {
  ADMIN: "Administrador",
  USER: "Cliente",
};

export const AdminUsersPage = () => {
  const [page, setPage] = useState(1);
  const {
    users,
    page: responsePage,
    pages,
    total,
    limit,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAdminUsers({ page, limit: ADMIN_USERS_PAGE_SIZE });

  const updateMutation = useUpdateUser();
  const sessionUserId = useAuthStore((s) => s.user?.id);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [softDeleteOpen, setSoftDeleteOpen] = useState(false);
  const [userToSoftDelete, setUserToSoftDelete] = useState<User | null>(null);

  const openCreate = () => {
    setEditingUserId(null);
    setModalOpen(true);
  };

  const openEdit = (id: string) => {
    setEditingUserId(id);
    setModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) setEditingUserId(null);
  };

  const openSoftDelete = (u: User) => {
    setUserToSoftDelete(u);
    setSoftDeleteOpen(true);
  };

  const handleSoftDeleteOpenChange = (open: boolean) => {
    setSoftDeleteOpen(open);
    if (!open) setUserToSoftDelete(null);
  };

  const confirmSoftDelete = async () => {
    if (!userToSoftDelete) return;
    try {
      await updateMutation.mutateAsync({
        userId: userToSoftDelete.id,
        isDeleted: true,
      });
      toast.success("Usuario marcado como eliminado");
      handleSoftDeleteOpenChange(false);
    } catch {
      toast.error("No se pudo actualizar el usuario");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"
          aria-hidden
        />
        <span className="sr-only">Cargando usuarios</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-lg rounded-xl border border-red-100 bg-red-50/40 p-8 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            No pudimos cargar los usuarios
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Revisa tu conexión e inténtalo de nuevo.
          </p>
          <Button className="mt-6" variant="outline" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminUserFormModal
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        userId={editingUserId}
      />

      <Dialog open={softDeleteOpen} onOpenChange={handleSoftDeleteOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Marcar usuario como eliminado?</DialogTitle>
            <DialogDescription>
              {userToSoftDelete ? (
                <>
                  Se marcará{" "}
                  <span className="font-semibold text-slate-900">
                    {userToSoftDelete.name}
                  </span>{" "}
                  ({userToSoftDelete.email}) como eliminado (soft delete).
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={updateMutation.isPending}
              onClick={() => handleSoftDeleteOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={updateMutation.isPending}
              onClick={() => void confirmSoftDelete()}
            >
              {updateMutation.isPending ? "Guardando…" : "Marcar eliminado"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <header className="border-b border-slate-200 bg-white px-6 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-violet-700">
              <Users className="size-4" aria-hidden />
              Administración
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Usuarios
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Alta, edición y baja lógica (isDeleted). No se usa borrado físico.
            </p>
          </div>
          <Button type="button" className="shrink-0 gap-2" onClick={openCreate}>
            <Plus className="size-4" aria-hidden />
            Nuevo usuario
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8">
        {users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <Users
              className="mx-auto h-12 w-12 text-slate-400"
              strokeWidth={1.25}
              aria-hidden
            />
            <p className="mt-4 font-semibold text-slate-900">
              No hay usuarios registrados
            </p>
            <Button className="mt-6" variant="secondary" onClick={openCreate}>
              Añadir usuario
            </Button>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
                isFetching && !isLoading && "opacity-70",
              )}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">Correo</th>
                      <th className="px-4 py-3">Rol</th>
                      <th className="hidden px-4 py-3 lg:table-cell">Alta</th>
                      <th className="px-4 py-3">Activo</th>
                      <th className="px-4 py-3">Eliminado</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr
                        key={u.id}
                        className="transition-colors hover:bg-slate-50/60"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {u.name}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{u.email}</td>
                        <td className="px-4 py-3 text-slate-800">
                          {USER_ROLE_LABEL[u.role]}
                        </td>
                        <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">
                          {formatOrderDate(u.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                              u.isActive
                                ? "bg-emerald-50 text-emerald-800"
                                : "bg-slate-100 text-slate-600",
                            )}
                          >
                            {u.isActive ? "Sí" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                              u.isDeleted
                                ? "bg-red-50 text-red-800"
                                : "bg-slate-100 text-slate-600",
                            )}
                          >
                            {u.isDeleted ? "Sí" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-1 border-slate-200"
                              onClick={() => openEdit(u.id)}
                            >
                              <Pencil className="size-3.5" aria-hidden />
                              Editar
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="gap-1"
                              disabled={
                                updateMutation.isPending ||
                                u.isDeleted ||
                                u.id === sessionUserId
                              }
                              onClick={() => openSoftDelete(u)}
                              title={
                                u.id === sessionUserId
                                  ? "No puedes eliminar tu propia sesión"
                                  : u.isDeleted
                                    ? "Ya está eliminado"
                                    : "Marcar como eliminado"
                              }
                            >
                              <Trash2 className="size-3.5" aria-hidden />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <TablePagination
                page={responsePage}
                pages={pages}
                total={total}
                limit={limit}
                countOnPage={users.length}
                isBusy={isFetching}
                onPageChange={setPage}
                ariaLabel="Paginación de usuarios"
                totalItemLabel="usuarios"
                emptySummaryText="Sin usuarios"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
