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
import { useAdminDiscount } from "@/admin/hooks/useAdminDiscount";
import { useCreateDiscount } from "@/admin/hooks/useCreateDiscount";
import { useUpdateDiscount } from "@/admin/hooks/useUpdateDiscount";

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface FormInputs {
  name: string;
  percentage: number;
  startDate: string;
  endDate: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discountId: string | null;
}

export const AdminDiscountFormModal = ({
  open,
  onOpenChange,
  discountId,
}: Props) => {
  const isEdit = discountId != null;
  const { data: discount, isLoading, isError, refetch } = useAdminDiscount(
    discountId ?? undefined,
    open && isEdit,
  );

  const createMutation = useCreateDiscount();
  const updateMutation = useUpdateDiscount();
  const busy = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      name: "",
      percentage: 10,
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (!isEdit) {
      const start = new Date();
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      reset({
        name: "",
        percentage: 10,
        startDate: toDatetimeLocalValue(start.toISOString()),
        endDate: toDatetimeLocalValue(end.toISOString()),
      });
      return;
    }
    if (discount) {
      reset({
        name: discount.name,
        percentage: discount.percentage,
        startDate: toDatetimeLocalValue(discount.startDate),
        endDate: toDatetimeLocalValue(discount.endDate),
      });
    }
  }, [open, isEdit, discount, reset]);

  const onSubmit = async (data: FormInputs) => {
    const name = data.name.trim();
    if (!name) {
      toast.error("El nombre es obligatorio");
      return;
    }
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      toast.error("Fechas no válidas");
      return;
    }
    if (end <= start) {
      toast.error("La fecha de fin debe ser posterior al inicio");
      return;
    }
    if (!Number.isFinite(data.percentage)) {
      toast.error("Indica un porcentaje válido");
      return;
    }
    if (data.percentage < 0 || data.percentage > 100) {
      toast.error("El porcentaje debe estar entre 0 y 100");
      return;
    }
    try {
      if (isEdit && discountId) {
        await updateMutation.mutateAsync({
          discountId,
          name,
          percentage: data.percentage,
          startDate: start,
          endDate: end,
        });
        toast.success("Descuento actualizado");
      } else {
        await createMutation.mutateAsync({
          name,
          percentage: data.percentage,
          startDate: start,
          endDate: end,
        });
        toast.success("Descuento creado");
      }
      onOpenChange(false);
    } catch {
      toast.error(isEdit ? "No se pudo actualizar" : "No se pudo crear", {
        description: "Revisa los datos o la conexión.",
      });
    }
  };

  const showEditLoader = isEdit && open && isLoading;
  const showForm = !isEdit || (!!discount && !isError);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,640px)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar descuento" : "Nuevo descuento"}
          </DialogTitle>
          <DialogDescription>
            Define el nombre, el porcentaje y el periodo de vigencia.
          </DialogDescription>
        </DialogHeader>

        {showEditLoader ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
          </div>
        ) : null}

        {isEdit && isError && !isLoading ? (
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-4 text-center text-sm text-red-900">
            No se pudo cargar el descuento.
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
            id="admin-discount-form"
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-2">
              <Label htmlFor="discount-name">Nombre</Label>
              <Input
                id="discount-name"
                placeholder="Ej. Rebajas de verano"
                autoComplete="off"
                aria-invalid={!!errors.name}
                {...register("name", {
                  required: "El nombre es obligatorio",
                })}
              />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount-percentage">Porcentaje (%)</Label>
              <Input
                id="discount-percentage"
                type="number"
                min={0}
                max={100}
                step={0.01}
                aria-invalid={!!errors.percentage}
                {...register("percentage", {
                  required: "Indica un porcentaje",
                  valueAsNumber: true,
                  min: { value: 0, message: "Mínimo 0" },
                  max: { value: 100, message: "Máximo 100" },
                })}
              />
              {errors.percentage ? (
                <p className="text-sm text-destructive">
                  {errors.percentage.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount-start">Inicio</Label>
              <Input
                id="discount-start"
                type="datetime-local"
                aria-invalid={!!errors.startDate}
                {...register("startDate", { required: "Elige fecha de inicio" })}
              />
              {errors.startDate ? (
                <p className="text-sm text-destructive">
                  {errors.startDate.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount-end">Fin</Label>
              <Input
                id="discount-end"
                type="datetime-local"
                aria-invalid={!!errors.endDate}
                {...register("endDate", { required: "Elige fecha de fin" })}
              />
              {errors.endDate ? (
                <p className="text-sm text-destructive">
                  {errors.endDate.message}
                </p>
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
            form="admin-discount-form"
            disabled={
              busy || showEditLoader || (isEdit && isError) || !showForm
            }
          >
            {busy ? "Guardando…" : isEdit ? "Guardar" : "Crear descuento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
