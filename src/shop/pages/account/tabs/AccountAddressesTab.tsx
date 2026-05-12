import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { toast } from "sonner";
import { MapPin, Pencil, Star, Trash2 } from "lucide-react";
import { useAuthStore } from "@/auth/store/useAuthStore";
import type { UserAddressResponse } from "@/shop/interfaces/userAddressResponse";
import { useUserAddresses } from "@/shop/hooks/useUserAddresses";
import { useSetDefaultUserAddress } from "@/shop/hooks/useSetDefaultUserAddress";
import { useDeleteUserAddress } from "@/shop/hooks/useDeleteUserAddress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserAddressFormModal } from "@/shop/pages/account/components/UserAddressFormModal";

function addressActionErrorMessage(error: unknown): string {
  let message = "No se pudo completar la acción. Inténtalo de nuevo.";
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "string" && data.trim()) {
      message = data;
    } else if (data && typeof data === "object" && "message" in data) {
      const m = (data as { message?: unknown }).message;
      if (typeof m === "string") {
        message = m;
      }
    }
  }
  return message;
}

function sortAddressesDefaultFirst(
  list: UserAddressResponse[],
): UserAddressResponse[] {
  return [...list].sort(
    (a, b) => Number(b.isDefault) - Number(a.isDefault),
  );
}

interface AddressCardProps {
  address: UserAddressResponse;
  onEdit: (address: UserAddressResponse) => void;
  onSetDefault: (address: UserAddressResponse) => void;
  onDelete: (address: UserAddressResponse) => void;
  actionsBusy: boolean;
}

function AddressCard({
  address,
  onEdit,
  onSetDefault,
  onDelete,
  actionsBusy,
}: AddressCardProps) {
  return (
    <article className="rounded-xl border-2 border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-900">
            {address.city}, {address.state}
          </span>
          {address.isDefault ? (
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
              Predeterminada
            </span>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1 border-slate-200"
          disabled={actionsBusy}
          onClick={() => onEdit(address)}
        >
          <Pencil className="size-3.5" aria-hidden />
          Editar
        </Button>
      </div>
      <p className="mt-2 text-sm text-slate-700">{address.street}</p>
      <p className="mt-1 text-sm text-slate-600">
        {address.postalCode} · {address.country}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        {!address.isDefault ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="gap-1"
            disabled={actionsBusy}
            onClick={() => onSetDefault(address)}
          >
            <Star className="size-3.5" aria-hidden />
            Usar como predeterminada
          </Button>
        ) : null}
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="gap-1"
          disabled={actionsBusy}
          onClick={() => onDelete(address)}
        >
          <Trash2 className="size-3.5" aria-hidden />
          Eliminar
        </Button>
      </div>
    </article>
  );
}

export const AccountAddressesTab = () => {
  const user = useAuthStore((state) => state.user);
  const { addresses, isLoading, isError, refetch } = useUserAddresses();
  const setDefaultMutation = useSetDefaultUserAddress();
  const deleteMutation = useDeleteUserAddress();
  const addressActionsBusy =
    setDefaultMutation.isPending || deleteMutation.isPending;

  const [modalOpen, setModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] =
    useState<UserAddressResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] =
    useState<UserAddressResponse | null>(null);

  const openCreateModal = () => {
    setAddressToEdit(null);
    setModalOpen(true);
  };

  const openEditModal = (address: UserAddressResponse) => {
    setAddressToEdit(address);
    setModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setAddressToEdit(null);
    }
  };

  const handleSetDefault = async (address: UserAddressResponse) => {
    if (!user) return;
    try {
      await setDefaultMutation.mutateAsync({
        addressId: address.id,
        userId: user.id,
      });
      toast.success("Dirección predeterminada actualizada.", {
        description: "Tu lista de direcciones se ha actualizado.",
      });
    } catch (error) {
      toast.error("No se pudo marcar la dirección", {
        description: addressActionErrorMessage(error),
      });
    }
  };

  const openDeleteDialog = (address: UserAddressResponse) => {
    setAddressToDelete(address);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogOpenChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setAddressToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!user || !addressToDelete) return;
    try {
      await deleteMutation.mutateAsync({
        addressId: addressToDelete.id,
        userId: user.id,
      });
      toast.success("Dirección eliminada.", {
        description: "Tu lista de direcciones se ha actualizado.",
      });
      handleDeleteDialogOpenChange(false);
    } catch (error) {
      toast.error("No se pudo eliminar la dirección", {
        description: addressActionErrorMessage(error),
      });
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center">
        <MapPin
          className="mx-auto mb-4 h-14 w-14 text-slate-400"
          strokeWidth={1.25}
          aria-hidden
        />
        <h3 className="text-lg font-semibold text-slate-900">
          Inicia sesión para ver tus direcciones
        </h3>
        <p className="mt-2 max-w-sm text-sm text-slate-600">
          Necesitas una cuenta para consultar tus direcciones de envío.
        </p>
        <Button asChild className="mt-6" size="lg">
          <Link to="/login">Iniciar sesión</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center py-16">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"
          aria-hidden
        />
        <span className="sr-only">Cargando direcciones</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50/40 px-6 py-12 text-center">
        <h3 className="text-lg font-semibold text-slate-900">
          No pudimos cargar tus direcciones
        </h3>
        <p className="mt-2 max-w-sm text-sm text-slate-600">
          Revisa tu conexión e inténtalo de nuevo.
        </p>
        <Button className="mt-6" variant="outline" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  const sorted = sortAddressesDefaultFirst(addresses);

  return (
    <div className="flex flex-col gap-6">
      <UserAddressFormModal
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        addressToEdit={addressToEdit}
        userId={user.id}
        defaultNewAddressAsDefault={addresses.length === 0}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar esta dirección?</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-1">
                <p>
                  Esta acción no se puede deshacer. La dirección dejará de
                  aparecer en tu cuenta y en el checkout.
                </p>
                {addressToDelete ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 text-left text-sm text-slate-800">
                    <p className="font-medium text-slate-900">
                      {addressToDelete.city}, {addressToDelete.state}
                    </p>
                    <p className="mt-1 text-slate-700">{addressToDelete.street}</p>
                    <p className="mt-1 text-slate-600">
                      {addressToDelete.postalCode} · {addressToDelete.country}
                    </p>
                  </div>
                ) : null}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={deleteMutation.isPending}
              onClick={() => handleDeleteDialogOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => void handleConfirmDelete()}
            >
              {deleteMutation.isPending ? "Eliminando…" : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <header className="border-b border-slate-100 pb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Direcciones de envío
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Direcciones asociadas a tu cuenta.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm font-medium text-slate-700">
          {addresses.length === 0
            ? "Sin direcciones guardadas"
            : addresses.length === 1
              ? "1 dirección guardada"
              : `${addresses.length} direcciones guardadas`}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-2 border-slate-200"
          onClick={openCreateModal}
        >
          Añadir dirección
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-10 text-center">
          <MapPin
            className="mx-auto mb-3 h-10 w-10 text-slate-400"
            strokeWidth={1.25}
            aria-hidden
          />
          <p className="font-semibold text-slate-900">
            No tienes direcciones guardadas
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Añade una dirección para usarla en el checkout.
          </p>
          <Button
            type="button"
            className="mt-6"
            variant="secondary"
            onClick={openCreateModal}
          >
            Añadir dirección
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {sorted.map((address) => (
            <li key={address.id}>
              <AddressCard
                address={address}
                onEdit={openEditModal}
                onSetDefault={handleSetDefault}
                onDelete={openDeleteDialog}
                actionsBusy={addressActionsBusy}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
