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
import { useAdminMaterial } from "@/admin/hooks/useAdminMaterial";
import { useCreateMaterial } from "@/admin/hooks/useCreateMaterial";
import { useUpdateMaterial } from "@/admin/hooks/useUpdateMaterial";

interface FormInputs {
  name: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materialId: string | null;
}

export const AdminMaterialFormModal = ({
  open,
  onOpenChange,
  materialId,
}: Props) => {
  const isEdit = materialId != null;
  const { data: material, isLoading, isError, refetch } = useAdminMaterial(
    materialId ?? undefined,
    open && isEdit,
  );

  const createMutation = useCreateMaterial();
  const updateMutation = useUpdateMaterial();
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
    if (material) {
      reset({ name: material.name });
    }
  }, [open, isEdit, material, reset]);

  const onSubmit = async (data: FormInputs) => {
    const name = data.name.trim();
    if (!name) {
      toast.error("El nombre es obligatorio");
      return;
    }
    try {
      if (isEdit && materialId) {
        await updateMutation.mutateAsync({ materialId, name });
        toast.success("Material actualizado");
      } else {
        await createMutation.mutateAsync(name);
        toast.success("Material creado");
      }
      onOpenChange(false);
    } catch {
      toast.error(isEdit ? "No se pudo actualizar" : "No se pudo crear", {
        description: "Revisa los datos o la conexión.",
      });
    }
  };

  const showEditLoader = isEdit && open && isLoading;
  const showForm = !isEdit || (!!material && !isError);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar material" : "Nuevo material"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Actualiza el nombre del material (ej. Algodón, Denim)."
              : "Añade un material para asociarlo a productos."}
          </DialogDescription>
        </DialogHeader>

        {showEditLoader ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
          </div>
        ) : null}

        {isEdit && isError && !isLoading ? (
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-4 text-center text-sm text-red-900">
            No se pudo cargar el material.
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
            id="admin-material-form"
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-2">
              <Label htmlFor="material-name">Nombre</Label>
              <Input
                id="material-name"
                placeholder="Ej. Algodón, Poliéster"
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
            form="admin-material-form"
            disabled={
              busy || showEditLoader || (isEdit && isError) || !showForm
            }
          >
            {busy ? "Guardando…" : isEdit ? "Guardar" : "Crear material"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
