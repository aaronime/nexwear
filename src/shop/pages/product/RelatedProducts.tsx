import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { ProductCard } from "../home/ProductCard";
import { useSuggestedProducts } from "@/shop/hooks/useSuggestedProducts";
import { productListItemToCardProps } from "@/shop/lib/product-list-item-card";

interface Props {
  excludeProductId: string;
}

export const RelatedProducts = ({ excludeProductId }: Props) => {
  const { products, isLoading, isError } = useSuggestedProducts(excludeProductId);

  if (!isLoading && !isError && products.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 border-t border-slate-200 pt-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 lg:text-3xl">
          También te puede gustar
        </h2>
        {!isLoading && !isError && products.length > 0 ? (
          <div className="flex gap-2">
            <button
              type="button"
              className="related-prev flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-300 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
              aria-label="Anterior"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              className="related-next flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-300 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
              aria-label="Siguiente"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      {isError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          No se pudieron cargar las sugerencias. Intenta más tarde.
        </p>
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
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

      {!isLoading && !isError && products.length > 0 ? (
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".related-prev",
            nextEl: ".related-next",
          }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="h-auto">
              <ProductCard {...productListItemToCardProps(product)} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : null}
    </section>
  );
};
