import { Link } from "react-router";
import { toast } from "sonner";
import { useCart } from "@/shop/hooks/useCart";
import { useDeleteCartItem } from "@/shop/hooks/useDeleteCartItem";
import { useUpdateCartItemQuantity } from "@/shop/hooks/useUpdateCartItemQuantity";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { OrderSummary } from "@/shop/components/OrderSummary";
import { ShopBreadcrumbs } from "@/shop/components/ShopBreadcrumbs";

export const CartPage = () => {
  const { items, isLoading, isError, subtotal, shipping, tax, total } = useCart();
  const { removeCartItem, isRemoving, deletingItemId } = useDeleteCartItem();
  const { updateQuantity, isUpdatingQuantity, updatingQuantityItemId } =
    useUpdateCartItemQuantity();
  const user = useAuthStore((state) => state.user);

  

  if (!user) {
    return (
      <div className="min-h-[60vh]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg
              className="mx-auto h-16 w-16 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Inicia sesión para ver tu carrito
            </h2>
            <p className="mt-2 text-slate-600">
              Necesitas iniciar sesión para acceder a tu carrito de compras
            </p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link to="/login">Iniciar Sesión</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              Error al cargar el carrito
            </h2>
            <p className="mt-2 text-slate-600">
              Por favor, intenta de nuevo más tarde
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg
              className="mx-auto h-16 w-16 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Tu carrito está vacío
            </h2>
            <p className="mt-2 text-slate-600">
              Agrega productos para comenzar a comprar
            </p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link to="/">Explorar Productos</Link>
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
            { label: "Carrito de Compras" },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Carrito de Compras
          </h1>
          <p className="mt-2 text-slate-600">
            {items.length} {items.length === 1 ? "producto" : "productos"} en tu
            carrito
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="h-30 w-30 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400"
                      alt="Product"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Producto {item.productName}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Color: {item.productVariant.color}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Talla: {item.productVariant.size}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label="Disminuir cantidad"
                          disabled={
                            item.quantity <= 1 ||
                            (isRemoving && deletingItemId === item.id) ||
                            (isUpdatingQuantity &&
                              updatingQuantityItemId === item.id)
                          }
                          onClick={() =>
                            updateQuantity(
                              {
                                itemId: item.id,
                                quantity: item.quantity - 1,
                              },
                              {
                                onError: () =>
                                  toast.error(
                                    "No se pudo actualizar la cantidad.",
                                    { position: "bottom-right" },
                                  ),
                              },
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Aumentar cantidad"
                          disabled={
                            item.quantity >= item.productVariant.stock ||
                            (isRemoving && deletingItemId === item.id) ||
                            (isUpdatingQuantity &&
                              updatingQuantityItemId === item.id)
                          }
                          onClick={() =>
                            updateQuantity(
                              {
                                itemId: item.id,
                                quantity: item.quantity + 1,
                              },
                              {
                                onError: () =>
                                  toast.error(
                                    "No se pudo actualizar la cantidad.",
                                    { position: "bottom-right" },
                                  ),
                              },
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">
                          $
                          {(item.productVariant.price * item.quantity).toFixed(
                            2,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Eliminar del carrito"
                    disabled={isRemoving && deletingItemId === item.id}
                    onClick={() =>
                      removeCartItem(item.id, {
                        onError: () =>
                          toast.error("No se pudo eliminar el producto.", {
                            position: "bottom-right",
                          }),
                        onSuccess: () =>
                          toast.success("Producto eliminado del carrito.", {
                            position: "bottom-right",
                          }),
                      })
                    }
                    className="shrink-0 self-start rounded-md p-1 text-slate-400 transition-colors hover:text-red-600 disabled:opacity-50"
                  >
                    {isRemoving && deletingItemId === item.id ? (
                      <svg
                        className="h-5 w-5 animate-spin text-slate-500"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            nextPath="/checkout/shipping"
            buttonText="Seleccionar dirección de envío"
          />
        </div>
      </div>
    </div>
  );
};
