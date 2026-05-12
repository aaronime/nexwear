import { useState } from "react";
import { Link } from "react-router";
import { Package } from "lucide-react";
import type { Order } from "@/shop/interfaces/getOrdersResonse";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { DEFAULT_ORDERS_PAGE_SIZE, useOrders } from "@/shop/hooks/useOrders";
import { OrderStatusBadge } from "@/shop/components/OrderStatusBadge";
import { TablePagination } from "@/components/custom/TablePagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatMoney,
  formatOrderDate,
  PAYMENT_METHOD_LABEL,
} from "@/shop/lib/order-display";

interface OrderCardProps {
  order: Order;
}

function OrderCard({ order }: OrderCardProps) {
  const itemPreview = order.items.slice(0, 4);
  const remaining = order.items.length - itemPreview.length;

  return (
    <Link to={`/account/orders/${order.id}`}>

    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Pedido
          </p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-slate-900">
            #{order.id.slice(0, 8)}…
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {formatOrderDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
          <OrderStatusBadge status={order.status} />
          <p className="text-lg font-bold tabular-nums text-slate-900">
            {formatMoney(order.total)}
          </p>
        </div>
      </div>

      <div className="pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Productos ({order.items.length})
        </p>
        <ul className="mt-3 flex flex-wrap gap-3">
          {itemPreview.map((item) => (
            <li
              key={item.id}
              className="flex max-w-full items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 py-1.5 pl-1.5 pr-3"
            >
              <div className="size-11 shrink-0 overflow-hidden rounded-md bg-slate-200">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="size-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">
                  {item.productName}
                </p>
                <p className="text-xs text-slate-600">
                  {item.colorName} · {item.sizeName} · ×{item.quantity}
                </p>
              </div>
            </li>
          ))}
          {remaining > 0 ? (
            <li className="flex items-center rounded-lg border border-dashed border-slate-200 px-3 py-2 text-sm text-slate-600">
              +{remaining} más
            </li>
          ) : null}
        </ul>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:gap-x-6">
          <p>
            <span className="font-medium text-slate-700">Envío a:</span>{" "}
            {[order.city, order.state, order.country].filter(Boolean).join(", ")}
          </p>
          <p>
            <span className="font-medium text-slate-700">Pago:</span>{" "}
            {order.payment
              ? PAYMENT_METHOD_LABEL[order.payment.method]
              : "Sin información"}
          </p>
        </div>
      </div>
    </article>
    </Link>
  );
}

export const AccountOrdersTab = () => {
  const user = useAuthStore((state) => state.user);
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
  } = useOrders({ page, limit: DEFAULT_ORDERS_PAGE_SIZE });

  if (!user) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center">
        <Package
          className="mx-auto mb-4 h-14 w-14 text-slate-400"
          strokeWidth={1.25}
          aria-hidden
        />
        <h3 className="text-lg font-semibold text-slate-900">
          Inicia sesión para ver tus pedidos
        </h3>
        <p className="mt-2 max-w-sm text-sm text-slate-600">
          Necesitas una cuenta para consultar el historial de compras.
        </p>
        <Button asChild className="mt-6" size="lg">
          <Link to="/login">Iniciar sesión</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center py-16">
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
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50/40 px-6 py-12 text-center">
        <h3 className="text-lg font-semibold text-slate-900">
          No pudimos cargar tus pedidos
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

  if (total === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center">
        <Package
          className="mx-auto mb-4 h-14 w-14 text-slate-400"
          strokeWidth={1.25}
          aria-hidden
        />
        <h3 className="text-lg font-semibold text-slate-900">
          Aún no tienes pedidos
        </h3>
        <p className="mt-2 max-w-sm text-sm text-slate-600">
          Cuando realices una compra, aparecerá aquí.
        </p>
        <Button asChild className="mt-6" variant="secondary">
          <Link to="/">Explorar tienda</Link>
        </Button>
      </div>
    );
  }

  const summaryLabel =
    total === 1 ? "1 pedido en total" : `${total} pedidos en total`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Historial de pedidos
          </h3>
          <p className="text-sm text-slate-600">{summaryLabel}</p>
        </div>
      </div>
      {orders.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 py-12 text-center text-sm text-slate-600">
          No hay pedidos en esta página. Usa la paginación para elegir otra.
        </p>
      ) : (
        <ul
          className={cn(
            "space-y-4 transition-opacity",
            isFetching && !isLoading && "opacity-60",
          )}
        >
          {orders.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      )}
      <TablePagination
        page={responsePage}
        pages={pages}
        total={total}
        limit={limit}
        countOnPage={orders.length}
        isBusy={isFetching}
        onPageChange={setPage}
        ariaLabel="Paginación de pedidos"
        totalItemLabel="pedidos"
        emptySummaryText="Sin pedidos"
        className="border-slate-100"
      />
    </div>
  );
};
