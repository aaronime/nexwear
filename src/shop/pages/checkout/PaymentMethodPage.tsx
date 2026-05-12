import { useEffect } from "react";
import { Link } from "react-router";
import { MOCK_SAVED_PAYMENT_METHODS, PAYMENT_METHOD_BRAND_BADGE_CLASS } from "@/shop/mocks/mock-saved-payment-methods";
import { Button } from "@/components/ui/button";
import { OrderSummary } from "@/shop/components/OrderSummary";
import { ShopBreadcrumbs } from "@/shop/components/ShopBreadcrumbs";
import { useCart } from "@/shop/hooks/useCart";
import { useCheckoutStore } from "@/shop/store/useCheckoutStore";
import { useAuthStore } from "@/auth/store/useAuthStore";

export const PaymentMethodPage = () => {
  const user = useAuthStore((state) => state.user);
  const { subtotal, shipping, tax, total, isLoading } = useCart();
  const selectedPaymentMethodId = useCheckoutStore(
    (state) => state.selectedPaymentMethodId
  );
  const setSelectedPaymentMethodId = useCheckoutStore(
    (state) => state.setSelectedPaymentMethodId
  );

  useEffect(() => {
    if (MOCK_SAVED_PAYMENT_METHODS.length === 0) {
      setSelectedPaymentMethodId(null);
      return;
    }
    const isValid =
      selectedPaymentMethodId != null &&
      MOCK_SAVED_PAYMENT_METHODS.some((m) => m.id === selectedPaymentMethodId);
    if (!isValid) {
      setSelectedPaymentMethodId(MOCK_SAVED_PAYMENT_METHODS[0]!.id);
    }
  }, [selectedPaymentMethodId, setSelectedPaymentMethodId]);

  const subtotalSafe = Number(subtotal ?? 0);
  const shippingSafe = Number(shipping ?? 0);
  const taxSafe = Number(tax ?? 0);
  const totalSafe = Number(total ?? 0);

  if (!user) {
    return (
      <div className="min-h-[60vh] bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg
              className="mx-auto h-16 w-16 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Inicia sesión para continuar
            </h2>
            <p className="mt-2 text-slate-600">
              Necesitas una cuenta para elegir método de pago
            </p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link to="/login">Iniciar sesión</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ShopBreadcrumbs
          items={[
            { label: "Inicio", to: "/" },
            { label: "Carrito", to: "/cart" },
            { label: "Dirección de envío", to: "/checkout/shipping" },
            { label: "Método de pago" },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Método de pago
          </h1>
          <p className="mt-2 text-slate-600">
            Selecciona una tarjeta guardada para completar tu compra.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-700">
                {MOCK_SAVED_PAYMENT_METHODS.length} tarjetas guardadas{" "}
                <span className="text-slate-500">(demo)</span>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
              >
                Añadir tarjeta
              </Button>
            </div>

            <div className="space-y-3">
              {MOCK_SAVED_PAYMENT_METHODS.map((method) => {
                const isSelected = selectedPaymentMethodId === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethodId(method.id)}
                    className={`w-full rounded-xl border-2 bg-white p-5 text-left shadow-sm transition-all hover:border-slate-400 ${isSelected ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2" : "border-slate-200"}`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? "border-slate-900 bg-slate-900" : "border-slate-300 bg-white"}`}
                        aria-hidden
                      >
                        {isSelected ? (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        ) : null}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${PAYMENT_METHOD_BRAND_BADGE_CLASS[method.brand]}`}
                          >
                            {method.brand}
                          </span>
                          {method.isDefault && (
                            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                              Predeterminada
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-base font-semibold tracking-wide text-slate-900">
                          •••• •••• •••• {method.last4}
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {method.holderName}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Vence {method.expiryLabel}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <OrderSummary
            subtotal={subtotalSafe}
            shipping={shippingSafe}
            tax={taxSafe}
            total={totalSafe}
            nextPath="/checkout/review"
            buttonText="Revisar pedido"
          />
        </div>
      </div>
    </div>
  );
};
