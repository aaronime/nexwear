import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminProductVariant } from "@/admin/hooks/useAdminProductVariant";
import { useCreateProductVariant } from "@/admin/hooks/useCreateProductVariant";
import { useUpdateProductVariant } from "@/admin/hooks/useUpdateProductVariant";
import type { ProductFilters } from "@/admin/interfaces/getAllProductsResponse";

interface VariantFormValues {
  sku: string;
  stock: number;
  price: number;
  colorId: string;
  sizeId: string;
  isActive: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  variantId: string | null;
  filters: ProductFilters;
}

export const AdminProductVariantFormModal = ({
  open,
  onOpenChange,
  productId,
  variantId,
  filters,
}: Props) => {
  const isEdit = variantId != null;
  const { data: variant, isLoading, isError, refetch } = useAdminProductVariant(
    variantId ?? undefined,
    open && isEdit,
  );

  const createMutation = useCreateProductVariant();
  const updateMutation = useUpdateProductVariant();
  const busy = createMutation.isPending || updateMutation.isPending;

  const { register, handleSubmit, reset, control, formState } =
    useForm<VariantFormValues>({
      defaultValues: {
        sku: "",
        stock: 0,
        price: 0,
        colorId: "",
        sizeId: "",
        isActive: true,
      },
    });

  const { errors } = formState;

  useEffect(() => {
    if (!open) return;
    if (!isEdit) {
      reset({
        sku: "",
        stock: 0,
        price: 0,
        colorId: filters.colors[0]?.id ?? "",
        sizeId: filters.sizes[0]?.id ?? "",
        isActive: true,
      });
      return;
    }
    if (variant) {
      reset({
        sku: variant.sku,
        stock: variant.stock,
        price: variant.price,
        colorId: variant.colorId,
        sizeId: variant.sizeId,
        isActive: variant.isActive ?? true,
      });
    }
  }, [open, isEdit, variant, filters.colors, filters.sizes, reset]);

  const selectClass =
    "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  const onSubmit = async (data: VariantFormValues) => {
    const sku = data.sku.trim();
    if (!sku) {
      toast.error("El SKU es obligatorio");
      return;
    }
    if (!data.colorId || !data.sizeId) {
      toast.error("Selecciona color y talla");
      return;
    }
    try {
      if (isEdit && variantId) {
        await updateMutation.mutateAsync({
          productVariantId: variantId,
          productId,
          sku,
          stock: data.stock,
          price: data.price,
          colorId: data.colorId,
          sizeId: data.sizeId,
          isActive: data.isActive,
        });
        toast.success("Variante actualizada");
      } else {
        await createMutation.mutateAsync({
          productId,
          sku,
          stock: data.stock,
          price: data.price,
          colorId: data.colorId,
          sizeId: data.sizeId,
          isActive: data.isActive,
        });
        toast.success("Variante creada");
      }
      onOpenChange(false);
    } catch {
      toast.error(isEdit ? "No se pudo actualizar" : "No se pudo crear", {
        description: "¿SKU duplicado o error de red?",
      });
    }
  };

  const showLoader = isEdit && open && isLoading;
  const showForm = !isEdit || (!!variant && !isError);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar variante" : "Nueva variante"}
          </DialogTitle>
          <DialogDescription>
            SKU, stock, precio (variante), color y talla.
          </DialogDescription>
        </DialogHeader>

        {showLoader ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
          </div>
        ) : null}

        {isEdit && isError && !isLoading ? (
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-4 text-center text-sm text-red-900">
            No se pudo cargar la variante.
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => refetch()}
            >
              Reintentar
            </Button>
          </div>
        ) : null}

        {showForm && !showLoader ? (
          <form
            id="admin-variant-form"
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-2">
              <Label htmlFor="variant-sku">SKU</Label>
              <Input
                id="variant-sku"
                autoComplete="off"
                {...register("sku", { required: "SKU obligatorio" })}
              />
              {errors.sku ? (
                <p className="text-sm text-destructive">{errors.sku.message}</p>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="variant-stock">Stock</Label>
                <Input
                  id="variant-stock"
                  type="number"
                  min={0}
                  step={1}
                  {...register("stock", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Mínimo 0" },
                  })}
                />
                {errors.stock ? (
                  <p className="text-sm text-destructive">
                    {errors.stock.message}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="variant-price">Precio variante</Label>
                <Input
                  id="variant-price"
                  type="number"
                  step={0.01}
                  min={0}
                  {...register("price", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Mínimo 0" },
                  })}
                />
                {errors.price ? (
                  <p className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="variant-color">Color</Label>
              <select
                id="variant-color"
                className={selectClass}
                {...register("colorId", { required: true })}
              >
                {filters.colors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="variant-size">Talla</Label>
              <select
                id="variant-size"
                className={selectClass}
                {...register("sizeId", { required: true })}
              >
                {filters.sizes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Estado
              </p>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-input"
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    Activa
                  </label>
                )}
              />
            </div>
          </form>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="admin-variant-form"
            disabled={
              busy ||
              showLoader ||
              (isEdit && isError) ||
              !showForm ||
              filters.colors.length === 0 ||
              filters.sizes.length === 0
            }
          >
            {busy ? "Guardando…" : isEdit ? "Guardar" : "Crear variante"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
