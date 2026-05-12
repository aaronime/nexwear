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
import { useAdminSize } from "@/admin/hooks/useAdminSize";
import { useCreateSize } from "@/admin/hooks/useCreateSize";
import { useUpdateSize } from "@/admin/hooks/useUpdateSize";

interface FormInputs {
  name: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sizeId: string | null;
}

export const AdminSizeFormModal = ({ open, onOpenChange, sizeId }: Props) => {
  const isEdit = sizeId != null;
  const { data: size, isLoading, isError, refetch } = useAdminSize(
    sizeId ?? undefined,
    open && isEdit,
  );

  const createMutation = useCreateSize();
  const updateMutation = useUpdateSize();
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
    if (size) {
      reset({ name: size.name });
    }
  }, [open, isEdit, size, reset]);

  const onSubmit = async (data: FormInputs) => {
    const name = data.name.trim();
    if (!name) {
      toast.error("El nombre es obligatorio");
      return;
    }
    try {
      if (isEdit && sizeId) {
        await updateMutation.mutateAsync({ sizeId, name });
        toast.success("Talla actualizada");
      } else {
        await createMutation.mutateAsync(name);
        toast.success("Talla creada");
      }
      onOpenChange(false);
    } catch {
      toast.error(isEdit ? "No se pudo actualizar" : "No se pudo crear", {
        description: "Revisa los datos o la conexión.",
      });
    }
  };

  const showEditLoader = isEdit && open && isLoading;
  const showForm = !isEdit || (!!size && !isError);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar talla" : "Nueva talla"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Actualiza la etiqueta de talla (ej. M, 42, L)."
              : "Añade una talla para variantes de producto."}
          </DialogDescription>
        </DialogHeader>

        {showEditLoader ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
          </div>
        ) : null}

        {isEdit && isError && !isLoading ? (
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-4 text-center text-sm text-red-900">
            No se pudo cargar la talla.
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
            id="admin-size-form"
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-2">
              <Label htmlFor="size-name">Nombre</Label>
              <Input
                id="size-name"
                placeholder="Ej. M, 38, Única"
                autoComplete="off"
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
            form="admin-size-form"
            disabled={
              busy || showEditLoader || (isEdit && isError) || !showForm
            }
          >
            {busy ? "Guardando…" : isEdit ? "Guardar" : "Crear talla"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
