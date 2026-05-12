import { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import type { UserAddressResponse } from "@/shop/interfaces/userAddressResponse";
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
import { useCreateUserAddress } from "@/shop/hooks/useCreateUserAddress";
import { useUpdateUserAddress } from "@/shop/hooks/useUpdateUserAddress";
import { toast } from "sonner";

interface FormInputs {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addressToEdit: UserAddressResponse | null;
  userId: string;
  /** Si se crea una nueva dirección y es la primera, marcar predeterminada por defecto */
  defaultNewAddressAsDefault: boolean;
}

function addressFormDefaults(
  addressToEdit: UserAddressResponse | null,
  defaultNewAddressAsDefault: boolean,
): FormInputs {
  if (addressToEdit) {
    return {
      street: addressToEdit.street,
      city: addressToEdit.city,
      state: addressToEdit.state,
      country: addressToEdit.country,
      postalCode: addressToEdit.postalCode,
      isDefault: addressToEdit.isDefault,
    };
  }
  return {
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    isDefault: defaultNewAddressAsDefault,
  };
}

export const UserAddressFormModal = ({
  open,
  onOpenChange,
  addressToEdit,
  userId,
  defaultNewAddressAsDefault,
}: Props) => {
  const createMutation = useCreateUserAddress();
  const updateMutation = useUpdateUserAddress();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: addressFormDefaults(null, false),
  });

  useEffect(() => {
    if (!open) return;
    reset(addressFormDefaults(addressToEdit, defaultNewAddressAsDefault));
  }, [open, addressToEdit, defaultNewAddressAsDefault, reset]);

  const onSubmit = async (data: FormInputs) => {
    try {
      if (addressToEdit) {
        await updateMutation.mutateAsync({
          addressId: addressToEdit.id,
          userId,
          street: data.street,
          city: data.city,
          state: data.state,
          country: data.country,
          postalCode: data.postalCode,
          isDefault: data.isDefault,
        });
        toast.success("Dirección actualizada correctamente", {position: "bottom-right"})
      } else {
        await createMutation.mutateAsync({
          userId,
          street: data.street,
          city: data.city,
          state: data.state,
          country: data.country,
          postalCode: data.postalCode,
          isDefault: data.isDefault,
        });
        toast.success("Dirección añadida correctamente", {position: "bottom-right"})
      }
      onOpenChange(false);
    } catch (error) {
      let message = "No se pudo guardar la dirección. Inténtalo de nuevo.";
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        if (typeof data === "string" && data.trim()) {
          message = data;
        } else if (data && typeof data === "object" && "message" in data) {
          const m = (data as { message?: unknown }).message;
          if (typeof m === "string") message = m;
        }
      }
      toast.success(message, {position: "bottom-right"})
    }
  };

  const isEdit = addressToEdit != null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar dirección" : "Añadir dirección"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Actualiza los datos de envío. Los cambios se guardan en tu cuenta."
              : "Completa los datos de tu nueva dirección de envío."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="user-address-form"
          className="grid gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid gap-2">
            <Label htmlFor="address-street">Calle y número</Label>
            <Input
              id="address-street"
              autoComplete="street-address"
              aria-invalid={!!errors.street}
              {...register("street", {
                required: "La calle es obligatoria",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
              })}
            />
            {errors.street ? (
              <p className="text-sm text-destructive">{errors.street.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="address-city">Ciudad</Label>
              <Input
                id="address-city"
                autoComplete="address-level2"
                aria-invalid={!!errors.city}
                {...register("city", {
                  required: "La ciudad es obligatoria",
                  minLength: { value: 2, message: "Mínimo 2 caracteres" },
                })}
              />
              {errors.city ? (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address-state">Estado / Provincia</Label>
              <Input
                id="address-state"
                autoComplete="address-level1"
                aria-invalid={!!errors.state}
                {...register("state", {
                  required: "El estado es obligatorio",
                  minLength: { value: 2, message: "Mínimo 2 caracteres" },
                })}
              />
              {errors.state ? (
                <p className="text-sm text-destructive">{errors.state.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="address-postal">Código postal</Label>
              <Input
                id="address-postal"
                autoComplete="postal-code"
                aria-invalid={!!errors.postalCode}
                {...register("postalCode", {
                  required: "El código postal es obligatorio",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                })}
              />
              {errors.postalCode ? (
                <p className="text-sm text-destructive">
                  {errors.postalCode.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address-country">País</Label>
              <Input
                id="address-country"
                autoComplete="country-name"
                aria-invalid={!!errors.country}
                {...register("country", {
                  required: "El país es obligatorio",
                  minLength: { value: 2, message: "Mínimo 2 caracteres" },
                })}
              />
              {errors.country ? (
                <p className="text-sm text-destructive">
                  {errors.country.message}
                </p>
              ) : null}
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              className="size-4 rounded border-input accent-primary"
              {...register("isDefault")}
            />
            Usar como dirección predeterminada
          </label>
        </form>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="user-address-form"
            disabled={isPending}
          >
            {isPending ? "Guardando…" : isEdit ? "Guardar cambios" : "Añadir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
