import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import type { GetProductResponse } from "@/shop/interfaces/getProductResponse";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
  product: GetProductResponse;
}

export const ProductGallery = ({ product }: Props) => {
  const images = product.images
    .sort((a, b) => a.order - b.order)
    .map((img) => img.url);

  const fallbackImages = [
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800",
    "https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=800",
    "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800",
  ];

  const displayImages = images.length > 0 ? images : fallbackImages;
  const useLoop = displayImages.length > 1;

  const mainSwiperRef = useRef<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = (index: number) => {
    const swiper = mainSwiperRef.current;
    if (!swiper) return;
    if (useLoop) {
      swiper.slideToLoop(index);
    } else {
      swiper.slideTo(index);
    }
    setActiveIndex(index);
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [product.id]);

  return (
    <div className="space-y-4">
      <div className="group relative overflow-hidden rounded-2xl bg-slate-100">
        <Swiper
          key={product.id}
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: ".gallery-prev",
            nextEl: ".gallery-next",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          loop={useLoop}
          className="aspect-square w-full"
          onSwiper={(swiper) => {
            mainSwiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
        >
          {displayImages.map((image, index) => (
            <SwiperSlide key={`${image}-${index}`}>
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          className="gallery-prev absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white group-hover:block"
          aria-label="Imagen anterior"
        >
          <svg className="h-5 w-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          className="gallery-next absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white group-hover:block"
          aria-label="Imagen siguiente"
        >
          <svg className="h-5 w-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <div
              key={tag.id}
              className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white"
            >
              {tag.name}
            </div>
          ))}
          {product.discount && (
            <div className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
              -{product.discount.percentage}%
            </div>
          )}
        </div>
      </div>

      {displayImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-4">
          {displayImages.map((image, index) => (
            <button
              type="button"
              key={`${image}-thumb-${index}`}
              onClick={() => goToSlide(index)}
              className={`overflow-hidden rounded-lg border-2 transition-all hover:border-slate-900 ${
                activeIndex === index ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2" : "border-transparent"
              }`}
              aria-label={`Ver imagen ${index + 1}`}
              aria-current={activeIndex === index ? "true" : undefined}
            >
              <img
                src={image}
                alt={`${product.name} miniatura ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
