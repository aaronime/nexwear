import type { OrderStatus } from "@/shop/interfaces/createOrderResponse";
import {
  ORDER_STATUS_CLASS,
  ORDER_STATUS_LABEL,
} from "@/shop/lib/order-display";
import { cn } from "@/lib/utils";

interface Props {
  status: OrderStatus;
  className?: string;
}

export const OrderStatusBadge = ({ status, className }: Props) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        ORDER_STATUS_CLASS[status],
        className,
      )}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
};
