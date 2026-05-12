import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { PaymentStatus } from "@/shop/interfaces/createPaymentResponse";
import { PAYMENT_STATUS_LABEL } from "@/shop/lib/order-display";
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
import { useUpdatePaymentStatus } from "@/admin/hooks/useUpdatePaymentStatus";

const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
];

export interface PaymentForStatusUpdate {
  id: string;
  status: PaymentStatus;
}

interface Props {
  payment: PaymentForStatusUpdate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdatePaymentStatusModal = ({
  payment,
  open,
  onOpenChange,
}: Props) => {
  const [status, setStatus] = useState<PaymentStatus>("PENDING");
  const updateStatus = useUpdatePaymentStatus();

  useEffect(() => {
    if (open && payment) {
      setStatus(payment.status);
    }
  }, [open, payment]);

  const handleSubmit = async () => {
    if (!payment) return;
    try {
      await updateStatus.mutateAsync({ paymentId: payment.id, status });
      toast.success("Estado del pago actualizado");
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
          <DialogTitle>Cambiar estado del pago</DialogTitle>
          <DialogDescription>
            {payment ? (
              <>
                Pago{" "}
                <span className="font-mono font-medium text-slate-800">
                  #{payment.id.slice(0, 8)}…
                </span>
                {" · "}
                Estado actual:{" "}
                <span className="font-medium">
                  {PAYMENT_STATUS_LABEL[payment.status]}
                </span>
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          <Label htmlFor="admin-payment-status">Nuevo estado</Label>
          <select
            id="admin-payment-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as PaymentStatus)}
            disabled={updateStatus.isPending}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {PAYMENT_STATUS_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {PAYMENT_STATUS_LABEL[value]}
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
              updateStatus.isPending || !payment || status === payment.status
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
