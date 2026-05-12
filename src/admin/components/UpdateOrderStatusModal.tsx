import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { OrderStatus } from "@/shop/interfaces/createOrderResponse";
import {
  ORDER_STATUS_LABEL,
} from "@/shop/lib/order-display";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUpdateOrderStatus } from "@/admin/hooks/useUpdateOrderStatus";

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export interface OrderForStatusUpdate {
  id: string;
  status: OrderStatus;
}

interface Props {
  order: OrderForStatusUpdate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdateOrderStatusModal = ({
  order,
  open,
  onOpenChange,
}: Props) => {
  const [status, setStatus] = useState<OrderStatus>("PENDING");
  const updateStatus = useUpdateOrderStatus();

  useEffect(() => {
    if (open && order) {
      setStatus(order.status);
    }
  }, [open, order]);

  const handleSubmit = async () => {
    if (!order) return;
    try {
      await updateStatus.mutateAsync({ orderId: order.id, status });
      toast.success("Estado actualizado", {
        description: "El pedido se actualizó correctamente.",
      });
      onOpenChange(false);
    } catch {
      toast.error("No se pudo actualizar", {
        description: "Revisa la conexión o inténtalo de nuevo.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar estado del pedido</DialogTitle>
          <DialogDescription>
            {order ? (
              <>
                Pedido{" "}
                <span className="font-mono font-medium text-slate-800">
                  #{order.id.slice(0, 8)}…
                </span>
                {" · "}
                Estado actual:{" "}
                <span className="font-medium">
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          <Label htmlFor="admin-order-status">Nuevo estado</Label>
          <select
            id="admin-order-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            disabled={updateStatus.isPending}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {ORDER_STATUS_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {ORDER_STATUS_LABEL[value]}
              </option>
            ))}
          </select>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            disabled={updateStatus.isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={
              updateStatus.isPending || !order || status === order.status
            }
            onClick={() => void handleSubmit()}
          >
            {updateStatus.isPending ? "Guardando…" : "Actualizar estado"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
