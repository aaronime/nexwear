import { useState } from "react";
import { Link } from "react-router";
import { Pencil, Plus, Shirt, Trash2 } from "lucide-react";
import type { Product } from "@/admin/interfaces/getAllProductsResponse";
import {
  ADMIN_PRODUCTS_PAGE_SIZE,
  useAdminProducts,
} from "@/admin/hooks/useAdminProducts";
import { useAdminProductFilters } from "@/admin/hooks/useAdminProductFilters";
import { useUpdateProduct } from "@/admin/hooks/useUpdateProduct";
import { AdminCreateProductModal } from "@/admin/components/AdminCreateProductModal";
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
import { formatMoney } from "@/shop/lib/order-display";

export const AdminProductsPage = () => {
  const [page, setPage] = useState(1);
  const {
    products,
    page: responsePage,
    pages,
    total,
    limit,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAdminProducts({ page, limit: ADMIN_PRODUCTS_PAGE_SIZE });

  const {
    data: filters,
    isLoading: filtersLoading,
  } = useAdminProductFilters();

  const updateMutation = useUpdateProduct();

  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const openDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteOpen(true);
  };

  const handleDeleteOpenChange = (open: boolean) => {
    setDeleteOpen(open);
    if (!open) setProductToDelete(null);
  };

  const confirmSoftDelete = async () => {
    if (!productToDelete) return;
    try {
      await updateMutation.mutateAsync({
        productId: productToDelete.id,
        isDeleted: true,
      });
      toast.success("Producto marcado como eliminado");
      handleDeleteOpenChange(false);
    } catch {
      toast.error("No se pudo actualizar el producto", {
        description: "Revisa la conexión o los permisos.",
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
        <span className="sr-only">Cargando productos</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-lg rounded-xl border border-red-100 bg-red-50/40 p-8 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            No pudimos cargar los productos
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
      <AdminCreateProductModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        filters={filters}
        filtersLoading={filtersLoading}
      />

      <Dialog open={deleteOpen} onOpenChange={handleDeleteOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Marcar como eliminado?</DialogTitle>
            <DialogDescription>
              {productToDelete ? (
                <>
                  Se marcará{" "}
                  <span className="font-semibold text-slate-900">
                    {productToDelete.name}
                  </span>{" "}
                  como eliminado (soft delete). Podrás restaurarlo editando el
                  producto.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={updateMutation.isPending}
              onClick={() => handleDeleteOpenChange(false)}
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
              <Shirt className="size-4" aria-hidden />
              Catálogo
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Productos
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Listado, alta y ficha con datos, variantes (color × talla) e
              imágenes.
            </p>
          </div>
          <Button
            type="button"
            className="shrink-0 gap-2"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-4" aria-hidden />
            Nuevo producto
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8">
        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <Shirt
              className="mx-auto h-12 w-12 text-slate-400"
              strokeWidth={1.25}
              aria-hidden
            />
            <p className="mt-4 font-semibold text-slate-900">
              No hay productos
            </p>
            <Button
              className="mt-6"
              variant="secondary"
              onClick={() => setCreateOpen(true)}
            >
              Crear producto
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
                <table className="w-full min-w-[880px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 w-16"> </th>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">Marca</th>
                      <th className="px-4 py-3">Precio</th>
                      <th className="px-4 py-3">Activo</th>
                      <th className="px-4 py-3">Eliminado</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="transition-colors hover:bg-slate-50/60"
                      >
                        <td className="px-4 py-2">
                          <div className="size-12 overflow-hidden rounded-lg bg-slate-100">
                            {product.firstImage?.url ? (
                              <img
                                src={product.firstImage.url}
                                alt=""
                                className="size-full object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-[10px] text-slate-400">
                                —
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {product.name}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {product.brand?.name ?? "—"}
                        </td>
                        <td className="px-4 py-3 tabular-nums font-medium text-slate-900">
                          {formatMoney(product.finalPrice ?? product.price)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                              (product.isActive ?? true)
                                ? "bg-emerald-50 text-emerald-800"
                                : "bg-slate-100 text-slate-600",
                            )}
                          >
                            {(product.isActive ?? true) ? "Sí" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                              (product.isDeleted ?? false)
                                ? "bg-red-50 text-red-800"
                                : "bg-slate-100 text-slate-600",
                            )}
                          >
                            {(product.isDeleted ?? false) ? "Sí" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button
                              type="button"
                              variant="default"
                              size="sm"
                              className="gap-1"
                              asChild
                            >
                              <Link to={`/admin/products/${product.id}`}>
                                <Pencil className="size-3.5" aria-hidden />
                                Gestionar
                              </Link>
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="gap-1"
                              disabled={
                                updateMutation.isPending ||
                                (product.isDeleted ?? false)
                              }
                              onClick={() => openDelete(product)}
                              title={
                                (product.isDeleted ?? false)
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
                countOnPage={products.length}
                isBusy={isFetching}
                onPageChange={setPage}
                ariaLabel="Paginación de productos"
                totalItemLabel="productos"
                emptySummaryText="Sin productos"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
