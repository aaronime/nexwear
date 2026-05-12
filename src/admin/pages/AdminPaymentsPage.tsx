import { useState } from "react";
import { CreditCard, Eye, Pencil } from "lucide-react";
import { Link } from "react-router";
import type { Payment } from "@/admin/interfaces/getAllPaymentsResponse";
import {
  ADMIN_PAYMENTS_PAGE_SIZE,
  useAdminPayments,
} from "@/admin/hooks/useAdminPayments";
import { UpdatePaymentStatusModal } from "@/admin/components/UpdatePaymentStatusModal";
import { AdminPaymentDetailDialog } from "@/admin/components/AdminPaymentDetailDialog";
import { TablePagination } from "@/components/custom/TablePagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatMoney,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_CLASS,
  PAYMENT_STATUS_LABEL,
} from "@/shop/lib/order-display";

export const AdminPaymentsPage = () => {
  const [page, setPage] = useState(1);
  const {
    payments,
    page: responsePage,
    pages,
    total,
    limit,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAdminPayments({ page, limit: ADMIN_PAYMENTS_PAGE_SIZE });

  const [statusPayment, setStatusPayment] = useState<Payment | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [detailPaymentId, setDetailPaymentId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openStatusModal = (payment: Payment) => {
    setStatusPayment(payment);
    setStatusModalOpen(true);
  };

  const handleStatusModalOpenChange = (open: boolean) => {
    setStatusModalOpen(open);
    if (!open) setStatusPayment(null);
  };

  const openDetail = (paymentId: string) => {
    setDetailPaymentId(paymentId);
    setDetailOpen(true);
  };

  const handleDetailOpenChange = (open: boolean) => {
    setDetailOpen(open);
    if (!open) setDetailPaymentId(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"
          aria-hidden
        />
        <span className="sr-only">Cargando pagos</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-lg rounded-xl border border-red-100 bg-red-50/40 p-8 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            No pudimos cargar los pagos
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Revisa tu conexión e inténtalo de nuevo.
          </p>
          <Button className="mt-6" variant="outline" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <UpdatePaymentStatusModal
        payment={
          statusPayment
            ? { id: statusPayment.id, status: statusPayment.status }
            : null
        }
        open={statusModalOpen}
        onOpenChange={handleStatusModalOpenChange}
      />

      <AdminPaymentDetailDialog
        paymentId={detailPaymentId}
        open={detailOpen}
        onOpenChange={handleDetailOpenChange}
      />

      <header className="border-b border-slate-200 bg-white px-6 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-violet-700">
              <CreditCard className="size-4" aria-hidden />
              Operaciones
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Pagos
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Consulta pagos por pedido y actualiza el estado (pendiente,
              completado, fallido, reembolsado).
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8">
        {payments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <CreditCard
              className="mx-auto h-12 w-12 text-slate-400"
              strokeWidth={1.25}
              aria-hidden
            />
            <p className="mt-4 font-semibold text-slate-900">
              No hay pagos que mostrar
            </p>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
                isFetching && !isLoading && "opacity-70",
              )}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Pedido</th>
                      <th className="px-4 py-3">Método</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Importe</th>
                      <th className="hidden px-4 py-3 md:table-cell">
                        Transacción
                      </th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="transition-colors hover:bg-slate-50/60"
                      >
                        <td className="px-4 py-3">
                          <Link
                            to={`/admin/orders/${payment.orderId}`}
                            className="font-mono text-xs font-medium text-violet-700 underline-offset-4 hover:underline"
                          >
                            {payment.orderId.slice(0, 8)}…
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-slate-800">
                          {PAYMENT_METHOD_LABEL[payment.method]}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                              PAYMENT_STATUS_CLASS[payment.status],
                            )}
                          >
                            {PAYMENT_STATUS_LABEL[payment.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {formatMoney(payment.amount)}
                        </td>
                        <td className="hidden max-w-[140px] truncate px-4 py-3 font-mono text-xs text-slate-500 md:table-cell">
                          {payment.transactionId || "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-1 border-slate-200"
                              onClick={() => openDetail(payment.id)}
                            >
                              <Eye className="size-3.5" aria-hidden />
                              Ver
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="gap-1"
                              onClick={() => openStatusModal(payment)}
                            >
                              <Pencil className="size-3.5" aria-hidden />
                              Estado
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <TablePagination
                page={responsePage}
                pages={pages}
                total={total}
                limit={limit}
                countOnPage={payments.length}
                isBusy={isFetching}
                onPageChange={setPage}
                ariaLabel="Paginación de pagos"
                totalItemLabel="pagos"
                emptySummaryText="Sin pagos"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
