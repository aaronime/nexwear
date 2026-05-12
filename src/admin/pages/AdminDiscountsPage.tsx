import { useState } from "react";
import { Pencil, Percent, Plus, Trash2 } from "lucide-react";
import type { Discount } from "@/admin/interfaces/getAllDiscountsResponse";
import {
  ADMIN_DISCOUNTS_PAGE_SIZE,
  useAdminDiscounts,
} from "@/admin/hooks/useAdminDiscounts";
import { useDeleteDiscount } from "@/admin/hooks/useDeleteDiscount";
import { AdminDiscountFormModal } from "@/admin/components/AdminDiscountFormModal";
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

export const AdminDiscountsPage = () => {
  const [page, setPage] = useState(1);
  const {
    discounts,
    page: responsePage,
    pages,
    total,
    limit,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAdminDiscounts({ page, limit: ADMIN_DISCOUNTS_PAGE_SIZE });

  const deleteMutation = useDeleteDiscount();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDiscountId, setEditingDiscountId] = useState<string | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<Discount | null>(
    null,
  );

  const openCreate = () => {
    setEditingDiscountId(null);
    setModalOpen(true);
  };

  const openEdit = (id: string) => {
    setEditingDiscountId(id);
    setModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) setEditingDiscountId(null);
  };

  const openDeleteDialog = (discount: Discount) => {
    setDiscountToDelete(discount);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogOpenChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) setDiscountToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!discountToDelete) return;
    try {
      await deleteMutation.mutateAsync(discountToDelete.id);
      toast.success("Descuento eliminado");
      handleDeleteDialogOpenChange(false);
    } catch {
      toast.error("No se pudo eliminar el descuento", {
        description: "Puede estar en uso o hubo un error de red.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"
          aria-hidden
        />
        <span className="sr-only">Cargando descuentos</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-lg rounded-xl border border-red-100 bg-red-50/40 p-8 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            No pudimos cargar los descuentos
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
      <AdminDiscountFormModal
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        discountId={editingDiscountId}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar este descuento?</DialogTitle>
            <DialogDescription>
              {discountToDelete ? (
                <>
                  Se eliminará{" "}
                  <span className="font-semibold text-slate-900">
                    {discountToDelete.name}
                  </span>
                  . Esta acción no se puede deshacer. Si está asignado a
                  productos, el servidor puede rechazar la operación.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={deleteMutation.isPending}
              onClick={() => handleDeleteDialogOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => void handleConfirmDelete()}
            >
              {deleteMutation.isPending ? "Eliminando…" : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <header className="border-b border-slate-200 bg-white px-6 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-violet-700">
              <Percent className="size-4" aria-hidden />
              Catálogo
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Descuentos
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Gestiona campañas con porcentaje y fechas de vigencia.
            </p>
          </div>
          <Button type="button" className="shrink-0 gap-2" onClick={openCreate}>
            <Plus className="size-4" aria-hidden />
            Nuevo descuento
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8">
        {discounts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <Percent
              className="mx-auto h-12 w-12 text-slate-400"
              strokeWidth={1.25}
              aria-hidden
            />
            <p className="mt-4 font-semibold text-slate-900">
              No hay descuentos registrados
            </p>
            <Button className="mt-6" variant="secondary" onClick={openCreate}>
              Añadir descuento
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
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">%</th>
                      <th className="px-4 py-3">Inicio</th>
                      <th className="px-4 py-3">Fin</th>
                      <th className="hidden px-4 py-3 lg:table-cell">ID</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {discounts.map((discount) => (
                      <tr
                        key={discount.id}
                        className="transition-colors hover:bg-slate-50/60"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {discount.name}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-slate-800">
                          {discount.percentage}%
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {formatOrderDate(discount.startDate)}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {formatOrderDate(discount.endDate)}
                        </td>
                        <td className="hidden px-4 py-3 font-mono text-xs text-slate-500 lg:table-cell">
                          {discount.id}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-1 border-slate-200"
                              onClick={() => openEdit(discount.id)}
                            >
                              <Pencil className="size-3.5" aria-hidden />
                              Editar
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="gap-1"
                              disabled={deleteMutation.isPending}
                              onClick={() => openDeleteDialog(discount)}
                            >
                              <Trash2 className="size-3.5" aria-hidden />
                              Eliminar
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
                countOnPage={discounts.length}
                isBusy={isFetching}
                onPageChange={setPage}
                ariaLabel="Paginación de descuentos"
                totalItemLabel="descuentos"
                emptySummaryText="Sin descuentos"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
