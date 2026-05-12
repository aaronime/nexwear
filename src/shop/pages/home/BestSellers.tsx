import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useHomeTrendingProducts } from "@/shop/hooks/useHomeTrendingProducts";
import { productListItemToCardProps } from "@/shop/lib/product-list-item-card";

export const BestSellers = () => {
  const { products, isLoading, isError } = useHomeTrendingProducts();

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 text-center sm:text-left">
          <div className="mb-2 inline-flex justify-center sm:justify-start">
            <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-900">
              Basado en ventas del catálogo
            </span>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="mb-3 text-3xl font-bold text-slate-900 lg:text-4xl">
                Lo más vendido ahora
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600 sm:mx-0">
                Productos con más unidades vendidas entre los que tenemos listados. Para ver todo el
                catálogo, abre el buscador o elige un género en el menú.
              </p>
            </div>
            <Link
              to="/search"
              className="group hidden shrink-0 items-center gap-2 text-sm font-semibold text-slate-900 transition-all hover:gap-3 lg:inline-flex"
            >
              Ver catálogo completo
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`bs-sk-${i}`}
                className="animate-pulse overflow-hidden rounded-2xl bg-slate-50 shadow-sm"
              >
                <div className="aspect-4/5 bg-slate-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-5 w-28 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {isError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            No se pudieron cargar los productos más vendidos.
          </p>
        ) : null}

        {!isLoading && !isError && products.length === 0 ? (
          <p className="text-center text-slate-600">
            No hay suficientes datos de ventas todavía. Explora el catálogo para descubrir
            productos.
          </p>
        ) : null}

        {!isLoading && !isError && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} {...productListItemToCardProps(product)} />
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex justify-center lg:hidden">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
          >
            Ver catálogo completo
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
};
