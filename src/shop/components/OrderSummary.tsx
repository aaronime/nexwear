import { Button } from "@/components/ui/button";
import { Link } from "react-router";

interface Props {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  nextPath: string;
  buttonText: string;
}

export const OrderSummary = ({
  subtotal,
  shipping,
  tax,
  total,
  nextPath,
  buttonText,
}: Props) => {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Resumen del Pedido</h2>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Envío</span>
            <span className="font-semibold">
              {shipping === 0 && subtotal > 0 ? (
                <span className="text-emerald-700">Gratis</span>
              ) : (
                `$${shipping.toFixed(2)}`
              )}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>IVA (16%)</span>
            <span className="font-semibold">${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-slate-200 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-slate-900">Total</span>
              <span className="text-lg font-bold text-slate-900">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Link to={nextPath} className="mb-2 block">
            <Button className="w-full" size="lg">
              {buttonText}
            </Button>
          </Link>
          <Button variant="outline" className="w-full" size="lg" asChild>
            <Link to="/">Continuar Comprando</Link>
          </Button>
        </div>

        <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <svg
              className="h-5 w-5 shrink-0 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Envío gratis en compras mayores a $100</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <svg
              className="h-5 w-5 shrink-0 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Devoluciones gratis en 30 días</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <svg
              className="h-5 w-5 shrink-0 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Compra segura y protegida</span>
          </div>
        </div>
      </div>
    </div>
  );
};
