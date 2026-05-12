import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ShopBreadcrumbs } from "@/shop/components/ShopBreadcrumbs";

export const CheckoutSuccessPage = () => {
  return (
    <div className="min-h-[60vh] bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <ShopBreadcrumbs
          items={[
            { label: "Inicio", to: "/" },
            { label: "Pedido completado" },
          ]}
        />

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg
              className="h-8 w-8 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            ¡Pedido completado!
          </h1>
          <p className="mt-3 text-slate-600">
            Gracias por tu compra. Recibirás actualizaciones sobre tu envío por
            correo cuando estén disponibles.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            El detalle de tu orden aparecerá aquí cuando el servicio esté
            disponible.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="bg-slate-900 hover:bg-slate-800">
              <Link to="/">Volver al inicio</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2">
              <Link to="/cart">Ver carrito</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
