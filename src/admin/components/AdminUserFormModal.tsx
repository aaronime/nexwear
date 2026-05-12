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
import { useAdminUser } from "@/admin/hooks/useAdminUser";
import { useCreateUser } from "@/admin/hooks/useCreateUser";
import { useUpdateUser } from "@/admin/hooks/useUpdateUser";
import type { UpdateUserParams } from "@/admin/actions/update-user.action";
import type { UserRole } from "@/admin/interfaces/getAllUsersResponse";

interface FormValues {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  isDeleted: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
}

const selectClass =
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export const AdminUserFormModal = ({ open, onOpenChange, userId }: Props) => {
  const isEdit = userId != null;
  const { data: user, isLoading, isError, refetch } = useAdminUser(
    userId ?? undefined,
    open && isEdit,
  );

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const busy = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
      isActive: true,
      isDeleted: false,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (!isEdit) {
      reset({
        name: "",
        email: "",
        password: "",
        role: "USER",
        isActive: true,
        isDeleted: false,
      });
      return;
    }
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        isActive: user.isActive,
        isDeleted: user.isDeleted,
      });
    }
  }, [open, isEdit, user, reset]);

  const onSubmit = async (data: FormValues) => {
    const name = data.name.trim();
    const email = data.email.trim();
    if (!name || !email) {
      toast.error("Nombre y correo son obligatorios");
      return;
    }
    if (!isEdit) {
      const password = data.password.trim();
      if (!password || password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      try {
        await createMutation.mutateAsync({
          name,
          email,
          password,
          role: data.role,
        });
        toast.success("Usuario creado");
        onOpenChange(false);
      } catch {
        toast.error("No se pudo crear el usuario");
      }
      return;
    }
    if (!userId) return;
    try {
      const payload: UpdateUserParams = {
        userId,
        name,
        email,
        role: data.role,
        isActive: data.isActive,
        isDeleted: data.isDeleted,
      };
      const pwd = data.password.trim();
      if (pwd) {
        if (pwd.length < 6) {
          toast.error("La contraseña debe tener al menos 6 caracteres");
          return;
        }
        payload.password = pwd;
      }
      await updateMutation.mutateAsync(payload);
      toast.success("Usuario actualizado");
      onOpenChange(false);
    } catch {
      toast.error("No se pudo actualizar el usuario");
    }
  };

  const showLoader = isEdit && open && isLoading;
  const showForm = !isEdit || (!!user && !isError);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar usuario" : "Nuevo usuario"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Actualiza datos, rol y estado. Deja la contraseña vacía para no cambiarla."
              : "Crea una cuenta con rol administrador o cliente."}
          </DialogDescription>
        </DialogHeader>

        {showLoader ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
          </div>
        ) : null}

        {isEdit && isError && !isLoading ? (
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-4 text-center text-sm text-red-900">
            No se pudo cargar el usuario.
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
            id="admin-user-form"
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-2">
              <Label htmlFor="user-name">Nombre</Label>
              <Input
                id="user-name"
                autoComplete="name"
                {...register("name", { required: "Obligatorio" })}
              />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-email">Correo</Label>
              <Input
                id="user-email"
                type="email"
                autoComplete="email"
                {...register("email", { required: "Obligatorio" })}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-password">
                Contraseña
                {isEdit ? (
                  <span className="font-normal text-slate-500">
                    {" "}
                    (opcional)
                  </span>
                ) : null}
              </Label>
              <Input
                id="user-password"
                type="password"
                autoComplete="new-password"
                placeholder={isEdit ? "Vacío = sin cambios" : undefined}
                {...register("password", {
                  validate: (v) => {
                    if (!isEdit) {
                      if (!v?.trim()) return "Obligatoria al crear";
                      if (v.trim().length < 6) return "Mínimo 6 caracteres";
                    } else if (v?.trim() && v.trim().length < 6) {
                      return "Mínimo 6 caracteres";
                    }
                    return true;
                  },
                })}
              />
              {errors.password ? (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-role">Rol</Label>
              <select id="user-role" className={selectClass} {...register("role")}>
                <option value="USER">Cliente</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            {isEdit ? (
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
                      Activo
                    </label>
                  )}
                />
                <Controller
                  name="isDeleted"
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
                      Eliminado (soft delete)
                    </label>
                  )}
                />
              </div>
            ) : null}
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
            form="admin-user-form"
            disabled={
              busy || showLoader || (isEdit && isError) || !showForm
            }
          >
            {busy ? "Guardando…" : isEdit ? "Guardar" : "Crear usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
