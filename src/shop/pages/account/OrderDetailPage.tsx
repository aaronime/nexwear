import { Link, useParams } from "react-router";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { useOrder } from "@/shop/hooks/useOrder";
import type { OrderItem } from "@/shop/interfaces/getOrdersResonse";
import { ShopBreadcrumbs } from "@/shop/components/ShopBreadcrumbs";
import { OrderStatusBadge } from "@/shop/components/OrderStatusBadge";
import { OrderDeliveredReviewsSection } from "@/shop/components/OrderDeliveredReviewsSection";
import { Button } from "@/components/ui/button";
import {
  formatMoney,
  formatOrderDate,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
} from "@/shop/lib/order-display";

function isNotFoundError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

interface OrderLineRowProps {
  item: OrderItem;
}

function OrderLineRow({ item }: OrderLineRowProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <li className="flex gap-4 border-b border-slate-100 py-4 last:border-b-0">
      <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.productName}
            className="size-full object-cover"
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-900">{item.productName}</p>
        <p className="mt-1 text-sm text-slate-600">
          {item.colorName} · {item.sizeName}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          {formatMoney(item.price)} × {item.quantity}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-semibold tabular-nums text-slate-900">
          {formatMoney(lineTotal)}
        </p>
      </div>
    </li>
  );
}

export const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const user = useAuthStore((state) => state.user);
  const { order, isLoading, isError, error, refetch } = useOrder(orderId);

  if (!user) {
    return (
      <div className="min-h-[60vh] bg-linear-to-b from-slate-50/80 to-white pb-16">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Inicia sesión para ver este pedido
          </h1>
          <p className="mt-2 text-slate-600">
            Necesitas una cuenta para consultar el detalle de tus compras.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="min-h-[60vh] bg-linear-to-b from-slate-50/80 to-white pb-16">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Pedido no válido
          </h1>
          <Button asChild className="mt-8" variant="outline">
            <Link to="/account">Volver a mi cuenta</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-linear-to-b from-slate-50/80 to-white pb-16">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-24">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
            <span className="sr-only">Cargando pedido</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    const notFound = isNotFoundError(error);

    return (
      <div className="min-h-[60vh] bg-linear-to-b from-slate-50/80 to-white pb-16">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {notFound ? "Pedido no encontrado" : "No pudimos cargar el pedido"}
          </h1>
          <p className="mt-2 text-slate-600">
            {notFound
              ? "Comprueba el enlace o vuelve al historial de pedidos."
              : "Revisa tu conexión e inténtalo de nuevo."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {!notFound ? (
              <Button variant="outline" onClick={() => refetch()}>
                Reintentar
              </Button>
            ) : null}
            <Button asChild variant={notFound ? "default" : "outline"}>
              <Link to="/account">Ir a mi cuenta</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (order.userId !== user.id) {
    return (
      <div className="min-h-[60vh] bg-linear-to-b from-slate-50/80 to-white pb-16">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">
            No puedes ver este pedido
          </h1>
          <p className="mt-2 text-slate-600">
            Este pedido pertenece a otra cuenta.
          </p>
          <Button asChild className="mt-8" variant="outline">
            <Link to="/account">Volver a mi cuenta</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-[60vh] bg-linear-to-b from-slate-50/80 to-white pb-16">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <ShopBreadcrumbs
          items={[
            { label: "Inicio", to: "/" },
            { label: "Mi cuenta", to: "/account" },
            { label: `Pedido #${order.id.slice(0, 8)}…` },
          ]}
        />

        <Button asChild variant="ghost" className="mb-6 gap-2 px-0 hover:bg-transparent">
          <Link to="/account">
            <ArrowLeft className="size-4" aria-hidden />
            Volver a mi cuenta
          </Link>
        </Button>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Detalle del pedido
            </h1>
            <p className="mt-1 font-mono text-sm text-slate-600">
              ID: {order.id}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Realizado el {formatOrderDate(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <OrderStatusBadge status={order.status} />
            <p className="text-2xl font-bold tabular-nums text-slate-900">
              {formatMoney(order.total)}
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section
              aria-labelledby="order-items-heading"
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2
                id="order-items-heading"
                className="text-lg font-semibold text-slate-900"
              >
                Productos ({order.items.length})
              </h2>
              <ul className="mt-4">
                {order.items.map((item) => (
                  <OrderLineRow key={item.id} item={item} />
                ))}
              </ul>
            </section>

            {order.status === "DELIVERED" ? (
              <OrderDeliveredReviewsSection order={order} userId={user.id} />
            ) : null}
          </div>

          <div className="space-y-6">
            <section
              aria-labelledby="order-summary-heading"
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
            >
              <h2
                id="order-summary-heading"
                className="text-lg font-semibold text-slate-900"
              >
                Resumen
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4 text-slate-600">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums font-medium text-slate-900">
                    {formatMoney(order.subtotal)}
                  </dd>
                </div>
                {order.discount > 0.009 ? (
                  <div className="flex justify-between gap-4 text-slate-600">
                    <dt>Descuento</dt>
                    <dd className="tabular-nums font-medium text-slate-900">
                      −{formatMoney(order.discount)}
                    </dd>
                  </div>
                ) : null}
                {order.tax > 0.009 ? (
                  <div className="flex justify-between gap-4 text-slate-600">
                    <dt>Impuestos</dt>
                    <dd className="tabular-nums font-medium text-slate-900">
                      {formatMoney(order.tax)}
                    </dd>
                  </div>
                ) : null}
                {order.shipping > 0.009 ? (
                  <div className="flex justify-between gap-4 text-slate-600">
                    <dt>Envío</dt>
                    <dd className="tabular-nums font-medium text-slate-900">
                      {formatMoney(order.shipping)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4 border-t border-slate-100 pt-3 text-base font-semibold text-slate-900">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatMoney(order.total)}</dd>
                </div>
              </dl>
            </section>

            <section
              aria-labelledby="order-address-heading"
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
            >
              <h2
                id="order-address-heading"
                className="text-lg font-semibold text-slate-900"
              >
                Dirección de envío
              </h2>
              <address className="mt-4 not-italic text-sm leading-relaxed text-slate-600">
                <p className="font-medium text-slate-900">{order.street}</p>
                <p>
                  {order.city}, {order.state} {order.postalCode}
                </p>
                <p>{order.country}</p>
              </address>
            </section>

            <section
              aria-labelledby="order-payment-heading"
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
            >
              <h2
                id="order-payment-heading"
                className="text-lg font-semibold text-slate-900"
              >
                Pago
              </h2>
              {order.payment ? (
                <dl className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between gap-4">
                    <dt>Método</dt>
                    <dd className="font-medium text-slate-900">
                      {PAYMENT_METHOD_LABEL[order.payment.method]}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Estado del pago</dt>
                    <dd className="font-medium text-slate-900">
                      {PAYMENT_STATUS_LABEL[order.payment.status]}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Monto cobrado</dt>
                    <dd className="tabular-nums font-medium text-slate-900">
                      {formatMoney(order.payment.amount)}
                    </dd>
                  </div>
                  {order.payment.transactionId ? (
                    <div className="flex flex-col gap-1 pt-2">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">
                        Transacción
                      </dt>
                      <dd className="break-all font-mono text-xs text-slate-700">
                        {order.payment.transactionId}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              ) : (
                <p className="mt-4 text-sm text-slate-600">
                  Aún no hay información de pago asociada a este pedido.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};
