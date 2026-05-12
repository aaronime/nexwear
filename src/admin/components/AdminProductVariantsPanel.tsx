import { useMemo, useState } from "react";
import { Layers, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useProductVariants } from "@/admin/hooks/useProductVariants";
import { useUpdateProductVariant } from "@/admin/hooks/useUpdateProductVariant";
import { AdminProductVariantFormModal } from "@/admin/components/AdminProductVariantFormModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatMoney } from "@/shop/lib/order-display";
import type { ProductFilters } from "@/admin/interfaces/getAllProductsResponse";
import type { ProductVariant } from "@/admin/interfaces/productVariant";
import { cn } from "@/lib/utils";

interface Props {
  productId: string;
  filters: ProductFilters;
}

export const AdminProductVariantsPanel = ({ productId, filters }: Props) => {
  const { data: variants = [], isLoading, isError, refetch } =
    useProductVariants(productId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(
    null,
  );
  const [softDeleteOpen, setSoftDeleteOpen] = useState(false);
  const [variantToSoftDelete, setVariantToSoftDelete] =
    useState<ProductVariant | null>(null);

  const updateVariantMutation = useUpdateProductVariant();

  const colorNameById = useMemo(() => {
    const m = new Map<string, string>();
    filters.colors.forEach((c) => m.set(c.id, c.name));
    return m;
  }, [filters.colors]);

  const sizeNameById = useMemo(() => {
    const m = new Map<string, string>();
    filters.sizes.forEach((s) => m.set(s.id, s.name));
    return m;
  }, [filters.sizes]);

  const openCreate = () => {
    setEditingVariantId(null);
    setModalOpen(true);
  };

  const openEdit = (id: string) => {
    setEditingVariantId(id);
    setModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) setEditingVariantId(null);
  };

  const openSoftDelete = (v: ProductVariant) => {
    setVariantToSoftDelete(v);
    setSoftDeleteOpen(true);
  };

  const handleSoftDeleteOpenChange = (open: boolean) => {
    setSoftDeleteOpen(open);
    if (!open) setVariantToSoftDelete(null);
  };

  const confirmVariantSoftDelete = async () => {
    if (!variantToSoftDelete) return;
    try {
      await updateVariantMutation.mutateAsync({
        productVariantId: variantToSoftDelete.id,
        productId: variantToSoftDelete.productId,
        isDeleted: true,
      });
      toast.success("Variante marcada como eliminada");
      handleSoftDeleteOpenChange(false);
    } catch {
      toast.error("No se pudo actualizar la variante");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50/40 p-6 text-center text-sm">
        No se pudieron cargar las variantes.
        <Button className="mt-4" variant="outline" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Dialog open={softDeleteOpen} onOpenChange={handleSoftDeleteOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Marcar variante como eliminada?</DialogTitle>
            <DialogDescription>
              {variantToSoftDelete ? (
                <>
                  Se marcará la variante{" "}
                  <span className="font-mono font-medium text-slate-800">
                    {variantToSoftDelete.sku}
                  </span>{" "}
                  como eliminada (soft delete).
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={updateVariantMutation.isPending}
              onClick={() => handleSoftDeleteOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={updateVariantMutation.isPending}
              onClick={() => void confirmVariantSoftDelete()}
            >
              {updateVariantMutation.isPending
                ? "Guardando…"
                : "Marcar eliminada"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminProductVariantFormModal
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        productId={productId}
        variantId={editingVariantId}
        filters={filters}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Combinaciones color × talla con SKU, stock y precio propio.
        </p>
        <Button
          type="button"
          size="sm"
          className="gap-1"
          onClick={openCreate}
          disabled={filters.colors.length === 0 || filters.sizes.length === 0}
        >
          <Plus className="size-4" aria-hidden />
          Nueva variante
        </Button>
      </div>

      {filters.colors.length === 0 || filters.sizes.length === 0 ? (
        <p className="rounded-lg border border-amber-100 bg-amber-50/50 p-4 text-sm text-amber-900">
          Necesitas colores y tallas en el catálogo para crear variantes.
        </p>
      ) : null}

      {variants.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 py-14">
          <Layers className="size-10 text-slate-400" strokeWidth={1.25} />
          <p className="mt-3 text-sm font-medium text-slate-800">
            Sin variantes
          </p>
          <Button className="mt-4" variant="secondary" onClick={openCreate}>
            Añadir variante
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Color</th>
                  <th className="px-4 py-3">Talla</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Activa</th>
                  <th className="px-4 py-3">Eliminada</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {variants.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-mono text-xs font-medium">
                      {v.sku}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {colorNameById.get(v.colorId) ?? v.colorId}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {sizeNameById.get(v.sizeId) ?? v.sizeId}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{v.stock}</td>
                    <td className="px-4 py-3 tabular-nums font-medium">
                      {formatMoney(v.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                          (v.isActive ?? true)
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-slate-100 text-slate-600",
                        )}
                      >
                        {(v.isActive ?? true) ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                          (v.isDeleted ?? false)
                            ? "bg-red-50 text-red-800"
                            : "bg-slate-100 text-slate-600",
                        )}
                      >
                        {(v.isDeleted ?? false) ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => openEdit(v.id)}
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
                            updateVariantMutation.isPending ||
                            (v.isDeleted ?? false)
                          }
                          onClick={() => openSoftDelete(v)}
                          title={
                            (v.isDeleted ?? false)
                              ? "Ya está eliminada"
                              : "Marcar como eliminada"
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
      )}
    </div>
  );
};
