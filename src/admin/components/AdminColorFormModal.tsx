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
import { useAdminColor } from "@/admin/hooks/useAdminColor";
import { useCreateColor } from "@/admin/hooks/useCreateColor";
import { useUpdateColor } from "@/admin/hooks/useUpdateColor";

interface FormInputs {
  name: string;
  hex: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `null` = crear; id = editar (usa getColor al abrir) */
  colorId: string | null;
}

function normalizeHex(raw: string): string {
  let h = raw.trim().replace(/^#/, "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return `#${h.slice(0, 6).toUpperCase()}`;
}

const HEX_PATTERN = /^#?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/;

export const AdminColorFormModal = ({ open, onOpenChange, colorId }: Props) => {
  const isEdit = colorId != null;
  const { data: color, isLoading, isError, refetch } = useAdminColor(
    colorId ?? undefined,
    open && isEdit,
  );

  const createMutation = useCreateColor();
  const updateMutation = useUpdateColor();
  const busy = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: { name: "", hex: "#000000" },
  });

  const hexWatch = watch("hex");

  useEffect(() => {
    if (!open) return;
    if (!isEdit) {
      reset({ name: "", hex: "#000000" });
      return;
    }
    if (color) {
      const h = color.hex.startsWith("#") ? color.hex : `#${color.hex}`;
      reset({ name: color.name, hex: h.slice(0, 7) });
    }
  }, [open, isEdit, color, reset]);

  const onSubmit = async (data: FormInputs) => {
    const name = data.name.trim();
    const hex = normalizeHex(data.hex);
    if (!name) {
      toast.error("El nombre es obligatorio");
      return;
    }
    try {
      if (isEdit && colorId) {
        await updateMutation.mutateAsync({ colorId, name, hex });
        toast.success("Color actualizado");
      } else {
        await createMutation.mutateAsync({ name, hex });
        toast.success("Color creado");
      }
      onOpenChange(false);
    } catch {
      toast.error(isEdit ? "No se pudo actualizar" : "No se pudo crear", {
        description: "Revisa los datos o la conexión.",
      });
    }
  };

  const showForm = !isEdit || (!!color && !isError);
  const showEditLoader = isEdit && open && isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar color" : "Nuevo color"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Los cambios se reflejan en el catálogo al guardar."
              : "Añade un color para variantes de producto."}
          </DialogDescription>
        </DialogHeader>

        {showEditLoader ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
          </div>
        ) : null}

        {isEdit && isError && !isLoading ? (
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-4 text-center text-sm text-red-900">
            No se pudo cargar el color.
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
            id="admin-color-form"
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-2">
              <Label htmlFor="color-name">Nombre</Label>
              <Input
                id="color-name"
                placeholder="Ej. Rojo cereza"
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

            <div className="grid gap-2">
              <Label htmlFor="color-hex">Código HEX</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  id="color-hex"
                  placeholder="#FF0000"
                  className="min-w-0 flex-1 font-mono"
                  aria-invalid={!!errors.hex}
                  {...register("hex", {
                    required: "El hex es obligatorio",
                    validate: (v) =>
                      HEX_PATTERN.test(v.trim()) || "Formato HEX inválido",
                  })}
                />
                <input
                  type="color"
                  aria-label="Selector de color"
                  className="h-10 w-14 cursor-pointer rounded-md border border-input bg-background"
                  value={
                    HEX_PATTERN.test((hexWatch ?? "").trim())
                      ? normalizeHex(hexWatch ?? "").slice(0, 7)
                      : "#000000"
                  }
                  onChange={(e) => setValue("hex", e.target.value, { shouldValidate: true })}
                  disabled={busy}
                />
              </div>
              {errors.hex ? (
                <p className="text-sm text-destructive">{errors.hex.message}</p>
              ) : null}
              <div
                className="h-10 w-full max-w-xs rounded-md border border-slate-200"
                style={{
                  backgroundColor:
                    HEX_PATTERN.test((hexWatch ?? "").trim()) ?
                      normalizeHex(hexWatch ?? "")
                    : "#e2e8f0",
                }}
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
            form="admin-color-form"
            disabled={
              busy || showEditLoader || (isEdit && isError) || !showForm
            }
          >
            {busy ? "Guardando…" : isEdit ? "Guardar" : "Crear color"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
