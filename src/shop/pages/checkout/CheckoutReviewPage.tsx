import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShopBreadcrumbs } from "@/shop/components/ShopBreadcrumbs";
import { useCheckoutStore } from "@/shop/store/useCheckoutStore";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { useCart } from "@/shop/hooks/useCart";
import { useConfirmOrder } from "@/shop/hooks/useConfirmOrder";
import { useUserAddresses } from "@/shop/hooks/useUserAddresses";
import {
  MOCK_SAVED_PAYMENT_METHODS,
  PAYMENT_METHOD_BRAND_BADGE_CLASS,
} from "@/shop/mocks/mock-saved-payment-methods";

export const CheckoutReviewPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { selectedAddressId, selectedPaymentMethodId } = useCheckoutStore();
  const { cartId, items, isLoading: cartLoading, isError: cartError, subtotal, shipping, tax, total } =
    useCart();
  const { addresses, isLoading: addressesLoading, isError: addressesError } =
    useUserAddresses();
  const { confirmOrder, isConfirming } = useConfirmOrder();

  const shippingAddress =
    addresses.find((a) => a.id === selectedAddressId) ?? null;
  const paymentMethod =
    MOCK_SAVED_PAYMENT_METHODS.find(
      (m) => m.id === selectedPaymentMethodId
    ) ?? null;

  const subtotalSafe = Number(subtotal ?? 0);
  const shippingSafe = Number(shipping ?? 0);
  const taxSafe = Number(tax ?? 0);
  const totalSafe = Number(total ?? 0);

  const checkoutReady =
    items.length > 0 && shippingAddress != null && paymentMethod != null;

  const handleConfirmOrder = async () => {
    if (!checkoutReady || !user || !shippingAddress || !paymentMethod) {
      toast.error("Completa dirección y método de pago antes de confirmar.", {
        position: "bottom-right",
      });
      return;
    }

    try {
      if (!cartId) {
        toast.error("No se encontró el carrito.", {
          position: "bottom-right",
        });
        return;
      }

      await confirmOrder({
        tax: taxSafe,
        shipping: shippingSafe,
        discount: 0,
        cartId,
        userId: user.id,
        addressId: shippingAddress.id,
        items,
        paymentMethod,
        totalAmount: totalSafe,
      });
      toast.success("¡Pedido confirmado!", { position: "bottom-right" });
      navigate("/checkout/complete");
    } catch {
      toast.error(
        "No se pudo confirmar el pedido. Revisa tu conexión e inténtalo de nuevo.",
        { position: "bottom-right" }
      );
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Inicia sesión para revisar tu pedido
          </h2>
          <p className="mt-2 text-slate-600">
            Debes tener una cuenta activa para continuar el checkout.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cartLoading || addressesLoading) {
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

  if (cartError || addressesError) {
    return (
      <div className="min-h-[60vh] bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900">
            No se pudo cargar la revisión
          </h2>
          <p className="mt-2 text-slate-600">Vuelve a intentarlo más tarde.</p>
          <Button asChild className="mt-6" variant="outline">
            <Link to="/cart">Ir al carrito</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Tu carrito está vacío
          </h2>
          <p className="mt-2 text-slate-600">
            Añade productos antes de revisar el pedido.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link to="/">Explorar productos</Link>
          </Button>
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
            { label: "Método de pago", to: "/checkout/payment" },
            { label: "Revisar pedido" },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Revisión del pedido
          </h1>
          <p className="mt-2 text-slate-600">
            Verifica tus productos, envío y pago antes de confirmar.
          </p>
        </div>

        {!checkoutReady && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-semibold">Faltan datos en el checkout</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              {!shippingAddress && (
                <li>
                  Elige una{" "}
                  <Link
                    to="/checkout/shipping"
                    className="font-medium underline hover:no-underline"
                  >
                    dirección de envío
                  </Link>
                  .
                </li>
              )}
              {!paymentMethod && (
                <li>
                  Selecciona un{" "}
                  <Link
                    to="/checkout/payment"
                    className="font-medium underline hover:no-underline"
                  >
                    método de pago
                  </Link>
                  .
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section>
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Productos
              </h2>
              <div className="space-y-3">
                {items.map((item) => {
                  const lineTotal =
                    item.productVariant.price * item.quantity;
                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <img
                          src={item.productVariant.image}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {item.productName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.productVariant.color} · Talla{" "}
                          {item.productVariant.size}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                          Cantidad:{" "}
                          <span className="font-medium text-slate-900">
                            {item.quantity}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">
                          ${lineTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Dirección de envío
              </h2>
              {shippingAddress ? (
                <>
                  <p className="font-semibold text-slate-900">
                    {shippingAddress.city}, {shippingAddress.state}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {shippingAddress.street}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {shippingAddress.postalCode} · {shippingAddress.country}
                  </p>
                  <Link
                    to="/checkout/shipping"
                    className="mt-4 inline-block text-sm font-semibold text-slate-900 underline transition-colors hover:text-slate-600"
                  >
                    Cambiar dirección
                  </Link>
                </>
              ) : (
                <p className="text-sm text-slate-600">
                  Sin dirección seleccionada.{" "}
                  <Link
                    to="/checkout/shipping"
                    className="font-semibold underline hover:no-underline"
                  >
                    Elegir dirección
                  </Link>
                </p>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Método de pago
              </h2>
              {paymentMethod ? (
                <>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${PAYMENT_METHOD_BRAND_BADGE_CLASS[paymentMethod.brand]}`}
                    >
                      {paymentMethod.brand}
                    </span>
                    {paymentMethod.isDefault && (
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <p className="font-mono font-semibold tracking-wide text-slate-900">
                    •••• •••• •••• {paymentMethod.last4}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {paymentMethod.holderName}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Vence {paymentMethod.expiryLabel}
                  </p>
                  <Link
                    to="/checkout/payment"
                    className="mt-4 inline-block text-sm font-semibold text-slate-900 underline transition-colors hover:text-slate-600"
                  >
                    Cambiar tarjeta
                  </Link>
                </>
              ) : (
                <p className="text-sm text-slate-600">
                  Sin método de pago seleccionado.{" "}
                  <Link
                    to="/checkout/payment"
                    className="font-semibold underline hover:no-underline"
                  >
                    Elegir pago
                  </Link>
                </p>
              )}
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Resumen del pedido
              </h2>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ${subtotalSafe.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Envío</span>
                  <span className="font-semibold">
                    ${shippingSafe.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>IVA (16%)</span>
                  <span className="font-semibold">${taxSafe.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-slate-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      ${totalSafe.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  type="button"
                  className="w-full bg-slate-900 hover:bg-slate-800"
                  size="lg"
                  disabled={!checkoutReady || isConfirming}
                  onClick={() => void handleConfirmOrder()}
                >
                  {isConfirming ? "Procesando…" : "Confirmar pedido"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-2"
                  size="lg"
                  asChild
                >
                  <Link to="/checkout/payment">Volver al pago</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-2"
                  size="lg"
                  asChild
                >
                  <Link to="/">Continuar comprando</Link>
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
        </div>
      </div>
    </div>
  );
};

