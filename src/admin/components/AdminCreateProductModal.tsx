import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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
import {
  AdminProductFormFields,
  type AdminProductFormValues,
} from "@/admin/components/AdminProductFormFields";
import { useCreateProduct } from "@/admin/hooks/useCreateProduct";
import type { ProductFilters } from "@/admin/interfaces/getAllProductsResponse";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ProductFilters | undefined;
  filtersLoading: boolean;
}

export const AdminCreateProductModal = ({
  open,
  onOpenChange,
  filters,
  filtersLoading,
}: Props) => {
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

  const { register, control, handleSubmit, reset, formState } =
    useForm<AdminProductFormValues>({
      defaultValues: {
        name: "",
        description: "",
        price: 0,
        brandId: "",
        categoryId: "",
        discountId: "",
        tagIds: [],
        materialIds: [],
        isActive: true,
      },
    });

  const { errors } = formState;

  useEffect(() => {
    if (!open) return;
    reset({
      name: "",
      description: "",
      price: 0,
      brandId: "",
      categoryId: "",
      discountId: "",
      tagIds: [],
      materialIds: [],
      isActive: true,
    });
  }, [open, reset]);

  const onSubmit = async (data: AdminProductFormValues) => {
    if (!filters) return;
    try {
      const created = await createMutation.mutateAsync({
        name: data.name.trim(),
        description: data.description.trim(),
        price: data.price,
        brandId: data.brandId,
        categoryId: data.categoryId,
        discountId: data.discountId || undefined,
        tagIds: data.tagIds,
        materialIds: data.materialIds,
        isActive: data.isActive,
      });
      toast.success("Producto creado");
      onOpenChange(false);
      navigate(`/admin/products/${created.id}`);
    } catch {
      toast.error("No se pudo crear el producto", {
        description: "Revisa los datos o la conexión.",
      });
    }
  };

  const busy = createMutation.isPending;
  const canShowForm = !!filters && !filtersLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92vh,720px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuevo producto</DialogTitle>
          <DialogDescription>
            Completa los datos. Luego podrás añadir variantes e imágenes desde
            la ficha del producto.
          </DialogDescription>
        </DialogHeader>

        {filtersLoading || !filters ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
          </div>
        ) : (
          <form
            id="admin-create-product-form"
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <AdminProductFormFields
              register={register}
              control={control}
              errors={errors}
              filters={filters}
              mode="create"
            />
          </form>
        )}

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
            form="admin-create-product-form"
            disabled={busy || !canShowForm}
          >
            {busy ? "Creando…" : "Crear y gestionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
