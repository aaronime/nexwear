import { Link } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAdminPayment } from "@/admin/hooks/useAdminPayment";
import {
  formatMoney,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_CLASS,
  PAYMENT_STATUS_LABEL,
} from "@/shop/lib/order-display";
import { cn } from "@/lib/utils";

interface Props {
  paymentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminPaymentDetailDialog = ({
  paymentId,
  open,
  onOpenChange,
}: Props) => {
  const { data: payment, isLoading, isError, refetch } = useAdminPayment(
    paymentId ?? undefined,
    open && paymentId != null,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalle del pago</DialogTitle>
          <DialogDescription>
            Información actualizada desde el servidor.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
          </div>
        ) : null}

        {isError && !isLoading ? (
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-4 text-center text-sm text-red-900">
            No se pudo cargar el pago.
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

        {payment && !isLoading ? (
          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                ID
              </dt>
              <dd className="mt-1 font-mono text-xs text-slate-800">
                {payment.id}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Pedido
              </dt>
              <dd className="mt-1">
                <Link
                  to={`/admin/orders/${payment.orderId}`}
                  className="font-medium text-violet-700 underline-offset-4 hover:underline"
                  onClick={() => onOpenChange(false)}
                >
                  Ver pedido #{payment.orderId.slice(0, 8)}…
                </Link>
              </dd>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Método
                </dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {PAYMENT_METHOD_LABEL[payment.method]}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Estado
                </dt>
                <dd className="mt-1">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                      PAYMENT_STATUS_CLASS[payment.status],
                    )}
                  >
                    {PAYMENT_STATUS_LABEL[payment.status]}
                  </span>
                </dd>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Importe
                </dt>
                <dd className="mt-1 text-lg font-semibold text-slate-900">
                  {formatMoney(payment.amount)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  ID transacción
                </dt>
                <dd className="mt-1 font-mono text-xs text-slate-700 break-all">
                  {payment.transactionId || "—"}
                </dd>
              </div>
            </div>
          </dl>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
