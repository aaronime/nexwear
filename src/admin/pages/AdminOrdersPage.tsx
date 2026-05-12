import { useState } from "react";
import { Link } from "react-router";
import { Package, Plus } from "lucide-react";
import type { Order } from "@/admin/interfaces/getAllOrdersResponse";
import {
  ADMIN_ORDERS_PAGE_SIZE,
  useAdminOrders,
} from "@/admin/hooks/useAdminOrders";
import { UpdateOrderStatusModal } from "@/admin/components/UpdateOrderStatusModal";
import { OrderStatusBadge } from "@/shop/components/OrderStatusBadge";
import { TablePagination } from "@/components/custom/TablePagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatMoney,
  formatOrderDate,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
} from "@/shop/lib/order-display";

export const AdminOrdersPage = () => {
  const [page, setPage] = useState(1);
  const {
    orders,
    page: responsePage,
    pages,
    total,
    limit,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAdminOrders({ page, limit: ADMIN_ORDERS_PAGE_SIZE });

  const [statusModalOrder, setStatusModalOrder] = useState<Order | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const openStatusModal = (order: Order) => {
    setStatusModalOrder(order);
    setStatusModalOpen(true);
  };

  const handleStatusModalOpenChange = (open: boolean) => {
    setStatusModalOpen(open);
    if (!open) setStatusModalOrder(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"
          aria-hidden
        />
        <span className="sr-only">Cargando pedidos</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-lg rounded-xl border border-red-100 bg-red-50/40 p-8 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            No pudimos cargar los pedidos
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
      <UpdateOrderStatusModal
        order={statusModalOrder}
        open={statusModalOpen}
        onOpenChange={handleStatusModalOpenChange}
      />

      <header className="border-b border-slate-200 bg-white px-6 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-violet-700">
              <Package className="size-4" aria-hidden />
              Operaciones
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Pedidos
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Listado de todos los pedidos. Cambia el estado o crea un pedido
              manualmente desde el formulario.
            </p>
          </div>
          <Button asChild className="shrink-0 gap-2">
            <Link to="/admin/orders/new">
              <Plus className="size-4" aria-hidden />
              Nuevo pedido
            </Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8">
        {orders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <Package
              className="mx-auto h-12 w-12 text-slate-400"
              strokeWidth={1.25}
              aria-hidden
            />
            <p className="mt-4 font-semibold text-slate-900">
              No hay pedidos que mostrar
            </p>
            <Button asChild className="mt-6" variant="secondary">
              <Link to="/admin/orders/new">Crear primer pedido</Link>
            </Button>
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
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Pago</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition-colors hover:bg-slate-50/60"
                      >
                        <td className="px-4 py-3 font-mono text-slate-900">
                          #{order.id.slice(0, 8)}…
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-slate-600">
                            {order.userId.slice(0, 8)}…
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {formatOrderDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-3 font-semibold tabular-nums text-slate-900">
                          {formatMoney(order.total)}
                        </td>
                        <td className="px-4 py-3">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          <span className="block text-xs">
                            {PAYMENT_METHOD_LABEL[order.payment?.method]}
                          </span>
                          <span className="text-xs text-slate-500">
                            {PAYMENT_STATUS_LABEL[order.payment?.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="border-slate-200"
                            >
                              <Link to={`/admin/orders/${order.id}`}>
                                Ver detalle
                              </Link>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="border-slate-200"
                              onClick={() => openStatusModal(order)}
                            >
                              Cambiar estado
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
                countOnPage={orders.length}
                isBusy={isFetching}
                onPageChange={setPage}
                ariaLabel="Paginación de pedidos"
                emptySummaryText="Sin pedidos"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
