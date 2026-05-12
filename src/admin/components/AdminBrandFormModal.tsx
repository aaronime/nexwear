import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { useAdminBrand } from "@/admin/hooks/useAdminBrand";
import { useCreateBrand } from "@/admin/hooks/useCreateBrand";
import { useUpdateBrand } from "@/admin/hooks/useUpdateBrand";

interface FormInputs {
  name: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandId: string | null;
}

export const AdminBrandFormModal = ({ open, onOpenChange, brandId }: Props) => {
  const isEdit = brandId != null;
  const { data: brand, isLoading, isError, refetch } = useAdminBrand(
    brandId ?? undefined,
    open && isEdit,
  );

  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();
  const busy = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!open) return;
    if (!isEdit) {
      reset({ name: "" });
      return;
    }
    if (brand) {
      reset({ name: brand.name });
    }
  }, [open, isEdit, brand, reset]);

  const onSubmit = async (data: FormInputs) => {
    const name = data.name.trim();
    if (!name) {
      toast.error("El nombre es obligatorio");
      return;
    }
    try {
      if (isEdit && brandId) {
        await updateMutation.mutateAsync({ brandId, name });
        toast.success("Marca actualizada");
      } else {
        await createMutation.mutateAsync(name);
        toast.success("Marca creada");
      }
      onOpenChange(false);
    } catch {
      toast.error(isEdit ? "No se pudo actualizar" : "No se pudo crear", {
        description: "Revisa los datos o la conexión.",
      });
    }
  };

  const showEditLoader = isEdit && open && isLoading;
  const showForm = !isEdit || (!!brand && !isError);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar marca" : "Nueva marca"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Actualiza el nombre visible en el catálogo."
              : "Registra una marca para asociarla a productos."}
          </DialogDescription>
        </DialogHeader>

        {showEditLoader ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
          </div>
        ) : null}

        {isEdit && isError && !isLoading ? (
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-4 text-center text-sm text-red-900">
            No se pudo cargar la marca.
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

        {showForm && !showEditLoader ? (
          <form
            id="admin-brand-form"
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-2">
              <Label htmlFor="brand-name">Nombre</Label>
              <Input
                id="brand-name"
                placeholder="Ej. NexWear Original"
                autoComplete="organization"
                aria-invalid={!!errors.name}
                {...register("name", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 1, message: "Escribe un nombre" },
                })}
              />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
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
            form="admin-brand-form"
            disabled={
              busy || showEditLoader || (isEdit && isError) || !showForm
            }
          >
            {busy ? "Guardando…" : isEdit ? "Guardar" : "Crear marca"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
