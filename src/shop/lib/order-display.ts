import type { OrderStatus } from "@/shop/interfaces/createOrderResponse";
import type { PaymentMethod, PaymentStatus } from "@/shop/interfaces/createPaymentResponse";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  CREDIT_CARD: "Tarjeta de crédito",
  DEBIT_CARD: "Tarjeta de débito",
  PAYPAL: "PayPal",
  BANK_TRANSFER: "Transferencia",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING: "Pendiente",
  COMPLETED: "Completado",
  FAILED: "Fallido",
  REFUNDED: "Reembolsado",
};

export const PAYMENT_STATUS_CLASS: Record<PaymentStatus, string> = {
  PENDING:
    "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-200",
  COMPLETED:
    "bg-emerald-50 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-200",
  FAILED:
    "bg-red-50 text-red-800 ring-red-600/20 dark:bg-red-950/40 dark:text-red-200",
  REFUNDED:
    "bg-slate-100 text-slate-700 ring-slate-600/15 dark:bg-slate-800 dark:text-slate-300",
};

export const ORDER_STATUS_CLASS: Record<OrderStatus, string> = {
  PENDING:
    "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-200",
  CONFIRMED:
    "bg-sky-50 text-sky-800 ring-sky-600/20 dark:bg-sky-950/40 dark:text-sky-200",
  SHIPPED:
    "bg-violet-50 text-violet-800 ring-violet-600/20 dark:bg-violet-950/40 dark:text-violet-200",
  DELIVERED:
    "bg-emerald-50 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-200",
  CANCELLED:
    "bg-slate-100 text-slate-700 ring-slate-600/15 dark:bg-slate-800 dark:text-slate-300",
};

export function formatOrderDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
