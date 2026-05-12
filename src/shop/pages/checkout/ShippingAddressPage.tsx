import { useEffect } from "react";
import { Link } from "react-router";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { useUserAddresses } from "@/shop/hooks/useUserAddresses";
import { Button } from "@/components/ui/button";
import { OrderSummary } from "@/shop/components/OrderSummary";
import { ShopBreadcrumbs } from "@/shop/components/ShopBreadcrumbs";
import { useCart } from "@/shop/hooks/useCart";
import { useCheckoutStore } from "@/shop/store/useCheckoutStore";

export const ShippingAddressPage = () => {
  const user = useAuthStore((state) => state.user);
  const { addresses, isLoading, isError } = useUserAddresses();
  const selectedAddressId = useCheckoutStore(
    (state) => state.selectedAddressId
  );
  const setSelectedAddressId = useCheckoutStore(
    (state) => state.setSelectedAddressId
  );
  const { subtotal, shipping, tax, total } = useCart();

  useEffect(() => {
    if (addresses.length === 0) {
      setSelectedAddressId(null);
      return;
    }
    const isValid =
      selectedAddressId != null &&
      addresses.some((a) => a.id === selectedAddressId);
    if (!isValid) {
      setSelectedAddressId(
        addresses.find((a) => a.isDefault)?.id ?? addresses[0]!.id
      );
    }
  }, [addresses, selectedAddressId, setSelectedAddressId]);

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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Inicia sesión para continuar
            </h2>
            <p className="mt-2 text-slate-600">
              Necesitas una cuenta para gestionar direcciones de envío
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

  if (isError) {
    return (
      <div className="min-h-[60vh] bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              No se pudieron cargar las direcciones
            </h2>
            <p className="mt-2 text-slate-600">
              Intenta de nuevo más tarde o vuelve al carrito.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline">
                <Link to="/cart">Volver al carrito</Link>
              </Button>
              <Button asChild>
                <Link to="/">Ir al inicio</Link>
              </Button>
            </div>
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
            { label: "Dirección de envío" },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Dirección de envío
          </h1>
          <p className="mt-2 text-slate-600">
            Elige a dónde quieres recibir tu pedido.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-700">
                {addresses.length}{" "}
                {addresses.length === 1
                  ? "dirección guardada"
                  : "direcciones guardadas"}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
              >
                Añadir dirección
              </Button>
            </div>

            {addresses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="font-semibold text-slate-900">
                  No tienes direcciones guardadas
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Añade una dirección para poder enviar tu pedido.
                </p>
                <Button
                  type="button"
                  className="mt-6 bg-slate-900 text-white hover:bg-slate-800"
                >
                  Añadir mi primera dirección
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => {
                  const isSelected = selectedAddressId === address.id;
                  return (
                    <button
                      key={address.id}
                      type="button"
                      onClick={() => setSelectedAddressId(address.id)}
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
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              {address.city}, {address.state}
                            </span>
                            {address.isDefault && (
                              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                                Predeterminada
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-700">
                            {address.street}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {address.postalCode} · {address.country}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} nextPath="/checkout/payment" buttonText="Proceder con el pago" />
        </div>
      </div>
    </div>
  );
};
