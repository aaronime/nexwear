import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useHomeNewArrivals } from "@/shop/hooks/useHomeNewArrivals";
import { productListItemToCardProps } from "@/shop/lib/product-list-item-card";

export const FeaturedProducts = () => {
  const { products, isLoading, isError } = useHomeNewArrivals();

  return (
    <section className="bg-slate-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-3 text-3xl font-bold text-slate-900 lg:text-4xl">
              Recién llegados
            </h2>
            <p className="text-lg text-slate-600">
              Los últimos productos publicados en el catálogo (orden por fecha de alta).
            </p>
          </div>

          <Link
            to="/new-arrivals?sortBy=newest"
            className="group hidden items-center gap-2 text-sm font-semibold text-slate-900 transition-all hover:gap-3 lg:inline-flex"
          >
            Ver todas las novedades
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="aspect-4/5 bg-slate-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-5 w-24 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {isError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            No se pudieron cargar los productos. Intenta de nuevo más tarde.
          </p>
        ) : null}

        {!isLoading && !isError && products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
            <p className="text-slate-600">
              Aún no hay productos en el catálogo. Cuando el administrador los añada, aparecerán
              aquí.
            </p>
            <Link
              to="/search"
              className="mt-4 inline-flex text-sm font-semibold text-slate-900 underline-offset-4 hover:underline"
            >
              Ir al buscador
            </Link>
          </div>
        ) : null}

        {!isLoading && !isError && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...productListItemToCardProps(product)} />
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex justify-center lg:hidden">
          <Link
            to="/new-arrivals?sortBy=newest"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
          >
            Ver todas las novedades
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
};
