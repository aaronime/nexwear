import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { MessageSquarePlus, CheckCircle2 } from "lucide-react";
import { getProductReviews } from "@/shop/actions/get-product-reviews.action";
import type { Order, OrderItem } from "@/shop/interfaces/getOrdersResonse";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/shop/lib/order-display";
import { OrderProductReviewDialog } from "./OrderProductReviewDialog";

interface ProductGroup {
  productId: string;
  items: OrderItem[];
  displayItem: OrderItem;
}

function groupOrderItemsByProductId(items: OrderItem[]): ProductGroup[] {
  const map = new Map<string, OrderItem[]>();
  for (const item of items) {
    const pid = item.productId?.trim();
    if (!pid) continue;
    const list = map.get(pid) ?? [];
    list.push(item);
    map.set(pid, list);
  }
  return Array.from(map.entries()).map(([productId, lineItems]) => ({
    productId,
    items: lineItems,
    displayItem: lineItems[0],
  }));
}

interface Props {
  order: Order;
  userId: string;
}

export const OrderDeliveredReviewsSection = ({ order, userId }: Props) => {
  const groups = useMemo(
    () => groupOrderItemsByProductId(order.items),
    [order.items],
  );

  const [dialogProductId, setDialogProductId] = useState<string | null>(null);

  const reviewQueries = useQueries({
    queries: groups.map((g) => ({
      queryKey: ["product-reviews", g.productId] as const,
      queryFn: () => getProductReviews(g.productId),
      enabled: groups.length > 0,
      staleTime: 1000 * 60 * 2,
    })),
  });

  if (groups.length === 0) {
    return null;
  }

  const dialogGroup = groups.find((g) => g.productId === dialogProductId);

  return (
    <section
      aria-labelledby="delivered-reviews-heading"
      className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2
        id="delivered-reviews-heading"
        className="text-lg font-semibold text-slate-900"
      >
        Valorar tu compra
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Pedido entregado: una reseña por producto (si pediste varias tallas o colores del mismo
        artículo, cuenta como una sola reseña).
      </p>

      <ul className="mt-6 space-y-4">
        {groups.map((g, i) => {
          const q = reviewQueries[i];
          const existingReview = q.data?.reviews.some((r) => r.userId === userId);
          const isLoading = q.isPending;
          const variantSummary =
            g.items.length === 1
              ? `${g.displayItem.colorName} · ${g.displayItem.sizeName}`
              : `${g.items.length} variantes en este pedido`;

          const lineQty = g.items.reduce((acc, it) => acc + it.quantity, 0);

          return (
            <li
              key={g.productId}
              className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 flex-1 gap-3">
                <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                  {g.displayItem.imageUrl ? (
                    <img
                      src={g.displayItem.imageUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">{g.displayItem.productName}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{variantSummary}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Cantidad total: {lineQty} · Subtotal líneas:{" "}
                    {formatMoney(
                      g.items.reduce((acc, it) => acc + it.price * it.quantity, 0),
                    )}
                  </p>
                </div>
              </div>

              <div className="shrink-0 sm:pl-4">
                {isLoading ? (
                  <span className="text-sm text-slate-500">Comprobando…</span>
                ) : existingReview ? (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800">
                    <CheckCircle2 className="size-4 shrink-0" aria-hidden />
                    Ya valoraste este producto
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 border-slate-300"
                    onClick={() => setDialogProductId(g.productId)}
                  >
                    <MessageSquarePlus className="size-4" aria-hidden />
                    Escribir reseña
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {dialogGroup ? (
        <OrderProductReviewDialog
          open={!!dialogProductId}
          onOpenChange={(open) => {
            if (!open) setDialogProductId(null);
          }}
          userId={userId}
          productId={dialogGroup.productId}
          productName={dialogGroup.displayItem.productName}
        />
      ) : null}
    </section>
  );
};
