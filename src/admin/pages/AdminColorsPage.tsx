import { useState } from "react";
import { Palette, Pencil, Plus } from "lucide-react";
import {
  ADMIN_COLORS_PAGE_SIZE,
  useAdminColors,
} from "@/admin/hooks/useAdminColors";
import { AdminColorFormModal } from "@/admin/components/AdminColorFormModal";
import { TablePagination } from "@/components/custom/TablePagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HEX_BADGE = /^#?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/;

export const AdminColorsPage = () => {
  const [page, setPage] = useState(1);
  const {
    colors,
    page: responsePage,
    pages,
    total,
    limit,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAdminColors({ page, limit: ADMIN_COLORS_PAGE_SIZE });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingColorId, setEditingColorId] = useState<string | null>(null);

  const openCreate = () => {
    setEditingColorId(null);
    setModalOpen(true);
  };

  const openEdit = (id: string) => {
    setEditingColorId(id);
    setModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) setEditingColorId(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"
          aria-hidden
        />
        <span className="sr-only">Cargando colores</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-lg rounded-xl border border-red-100 bg-red-50/40 p-8 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            No pudimos cargar los colores
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
      <AdminColorFormModal
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        colorId={editingColorId}
      />

      <header className="border-b border-slate-200 bg-white px-6 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-violet-700">
              <Palette className="size-4" aria-hidden />
              Catálogo
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Colores
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Crea y edita colores para variantes de producto.
            </p>
          </div>
          <Button
            type="button"
            className="shrink-0 gap-2"
            onClick={openCreate}
          >
            <Plus className="size-4" aria-hidden />
            Nuevo color
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8">
        {colors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <Palette
              className="mx-auto h-12 w-12 text-slate-400"
              strokeWidth={1.25}
              aria-hidden
            />
            <p className="mt-4 font-semibold text-slate-900">
              No hay colores registrados
            </p>
            <Button className="mt-6" variant="secondary" onClick={openCreate}>
              Añadir color
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
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Muestra</th>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">HEX</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {colors.map((color) => {
                      const hex =
                        color.hex.startsWith("#") ? color.hex : `#${color.hex}`;
                      const previewOk = HEX_BADGE.test(hex);
                      return (
                        <tr
                          key={color.id}
                          className="transition-colors hover:bg-slate-50/60"
                        >
                          <td className="px-4 py-3">
                            <div
                              className="size-9 rounded-md border border-slate-200 shadow-inner"
                              style={{
                                backgroundColor: previewOk ? hex : "#e2e8f0",
                              }}
                              title={hex}
                            />
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {color.name}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-600">
                            {hex.toUpperCase()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-1 border-slate-200"
                              onClick={() => openEdit(color.id)}
                            >
                              <Pencil className="size-3.5" aria-hidden />
                              Editar
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
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
                countOnPage={colors.length}
                isBusy={isFetching}
                onPageChange={setPage}
                ariaLabel="Paginación de colores"
                totalItemLabel="colores"
                emptySummaryText="Sin colores"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
