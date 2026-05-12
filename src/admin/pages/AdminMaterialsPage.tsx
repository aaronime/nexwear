import { useState } from "react";
import { Layers, Pencil, Plus, Trash2 } from "lucide-react";
import type { Material } from "@/admin/interfaces/getAllMaterialsResponse";
import {
  ADMIN_MATERIALS_PAGE_SIZE,
  useAdminMaterials,
} from "@/admin/hooks/useAdminMaterials";
import { useDeleteMaterial } from "@/admin/hooks/useDeleteMaterial";
import { AdminMaterialFormModal } from "@/admin/components/AdminMaterialFormModal";
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

export const AdminMaterialsPage = () => {
  const [page, setPage] = useState(1);
  const {
    materials,
    page: responsePage,
    pages,
    total,
    limit,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAdminMaterials({ page, limit: ADMIN_MATERIALS_PAGE_SIZE });

  const deleteMutation = useDeleteMaterial();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(
    null,
  );

  const openCreate = () => {
    setEditingMaterialId(null);
    setModalOpen(true);
  };

  const openEdit = (id: string) => {
    setEditingMaterialId(id);
    setModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) setEditingMaterialId(null);
  };

  const openDeleteDialog = (material: Material) => {
    setMaterialToDelete(material);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogOpenChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) setMaterialToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!materialToDelete) return;
    try {
      await deleteMutation.mutateAsync(materialToDelete.id);
      toast.success("Material eliminado");
      handleDeleteDialogOpenChange(false);
    } catch {
      toast.error("No se pudo eliminar el material", {
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
        <span className="sr-only">Cargando materiales</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-lg rounded-xl border border-red-100 bg-red-50/40 p-8 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            No pudimos cargar los materiales
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
      <AdminMaterialFormModal
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        materialId={editingMaterialId}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar este material?</DialogTitle>
            <DialogDescription>
              {materialToDelete ? (
                <>
                  Se eliminará{" "}
                  <span className="font-semibold text-slate-900">
                    {materialToDelete.name}
                  </span>
                  . Esta acción no se puede deshacer. Si hay productos
                  asociados, el servidor puede rechazar la operación.
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
              <Layers className="size-4" aria-hidden />
              Catálogo
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Materiales
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Crea, edita y elimina materiales para el catálogo de productos.
            </p>
          </div>
          <Button type="button" className="shrink-0 gap-2" onClick={openCreate}>
            <Plus className="size-4" aria-hidden />
            Nuevo material
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8">
        {materials.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <Layers
              className="mx-auto h-12 w-12 text-slate-400"
              strokeWidth={1.25}
              aria-hidden
            />
            <p className="mt-4 font-semibold text-slate-900">
              No hay materiales registrados
            </p>
            <Button className="mt-6" variant="secondary" onClick={openCreate}>
              Añadir material
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
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {materials.map((material) => (
                      <tr
                        key={material.id}
                        className="transition-colors hover:bg-slate-50/60"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {material.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">
                          {material.id}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-1 border-slate-200"
                              onClick={() => openEdit(material.id)}
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
                              onClick={() => openDeleteDialog(material)}
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
                countOnPage={materials.length}
                isBusy={isFetching}
                onPageChange={setPage}
                ariaLabel="Paginación de materiales"
                totalItemLabel="materiales"
                emptySummaryText="Sin materiales"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
