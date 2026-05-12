import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import type { ProductListItem } from "@/shop/interfaces/getProductsResonse";
import { ProductCard } from "../home/ProductCard";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface Props {
  products: ProductListItem[];
  pagination: Pagination;
  isLoading: boolean;
  isError: boolean;
}

type ViewMode = "grid" | "list";

export const ProductGrid = ({ products, pagination, isLoading, isError }: Props) => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentSort = searchParams.get("sortBy") || "relevant";
  
  const handleSortChange = (sortValue: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (sortValue === "relevant") {
      newParams.delete("sortBy");
    } else {
      newParams.set("sortBy", sortValue);
    }
    newParams.delete("page");
    setSearchParams(newParams);
  };
  
  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(pagination.page * pagination.limit, pagination.total);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
          <p className="text-slate-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <svg className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">Error al cargar productos</h3>
          <p className="text-slate-600">Por favor, intenta de nuevo más tarde.</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <svg className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">No hay productos disponibles</h3>
          <p className="text-slate-600">Intenta ajustar tus filtros de búsqueda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Mostrando <span className="font-semibold text-slate-900">{startIndex}-{endIndex}</span> de{" "}
          <span className="font-semibold text-slate-900">{pagination.total}</span> productos
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-slate-700">
              Ordenar por:
            </label>
            <select
              id="sort"
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 transition-colors hover:border-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="relevant">Relevantes</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="newest">Más Recientes</option>
              <option value="best-selling">Más Vendidos</option>
              <option value="rating">Mejor Valorados</option>
            </select>
          </div>

          <div className="flex md:self-none self-end gap-2 rounded-lg border border-slate-300 p-1">
            <button 
              onClick={() => setViewMode("grid")}
              className={`rounded p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-slate-900 text-white"
                  : "text-slate-900 hover:bg-slate-100"
              }`}
              title="Vista de cuadrícula"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`rounded p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-slate-900 text-white"
                  : "text-slate-900 hover:bg-slate-100"
              }`}
              title="Vista de lista"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              brand={product.brand}
              name={product.name}
              price={product.finalPrice}
              originalPrice={product.price}
              discount={product.discount?.percentage}
              imageUrl={product.firstImage?.url ?? "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"}
              isNew={false}
              averageRating={product.averageRating}
              reviewCount={product.reviewCount}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group flex gap-6 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-lg"
            >
              <div className="relative h-auto w-full max-w-30 md:max-w-none md:h-40 md:w-40 overflow-hidden rounded-lg">
                <img
                  src={product.firstImage?.url ?? "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {product.discount && (
                  <div className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-[10px] md:text-xs font-bold text-white">
                    -{product.discount.percentage}%
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  {product.brand && (
                    <p className="mb-1 text-[10px] md:text-xs font-medium uppercase tracking-wider text-slate-500">
                      {product.brand.name}
                    </p>
                  )}
                  <h3 className="mb-2 text-md md:text-lg font-semibold text-slate-900 transition-colors group-hover:text-slate-700">
                    {product.name}
                  </h3>
                  
                  {product.reviewCount > 0 && (
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.averageRating)
                                ? "text-yellow-400"
                                : "text-slate-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-slate-600">
                        {product.averageRating.toFixed(1)} ({product.reviewCount} {product.reviewCount === 1 ? 'reseña' : 'reseñas'})
                      </span>
                    </div>
                  )}
                  
                  <p className="mb-2 line-clamp-2 text-sm text-slate-600">
                    {product.description}
                  </p>
                  
                  {product.soldCount > 0 && (
                    <p className="text-xs text-slate-500">
                      {product.soldCount} vendidos
                    </p>
                  )}
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="flex  items-baseline gap-2">
                    <span className="text-xl md:text-2xl font-bold text-slate-900">
                      ${product.finalPrice.toFixed(2)}
                    </span>
                    {product.discount && (
                      <span className="text-[10px] md:text-sm text-slate-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-white transition-all group-hover:bg-slate-800">
                    Ver producto
                    <svg className="h-2 w-2 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-slate-200 pt-8">
          <button 
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-50"
            disabled={pagination.page === 1}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
            const pageNumber = i + 1;
            const isActive = pageNumber === pagination.page;
            
            return (
              <button
                key={pageNumber}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {pagination.pages > 5 && (
            <>
              <span className="flex h-10 w-10 items-center justify-center text-slate-600">...</span>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-sm font-medium text-slate-700 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white">
                {pagination.pages}
              </button>
            </>
          )}

          <button 
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-50"
            disabled={pagination.page === pagination.pages}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
