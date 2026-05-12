import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export const HeroSwiper = () => {
  const slides = [
    {
      id: 1,
      title: "Moda que puedes filtrar",
      subtitle: "Catálogo real, sin colecciones inventadas",
      description:
        "Explora por género, marca, talla y color. Lo que ves es lo que puedes comprar, con variantes y stock.",
      cta: { label: "Ver novedades", to: "/new-arrivals?sortBy=newest" },
      ctaSecondary: { label: "Hombres", to: "/gender/men" },
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920",
      gradient: "from-slate-900/95 to-slate-700/85",
    },
    {
      id: 2,
      title: "Tu talla, tu color",
      subtitle: "Variantes como en tienda",
      description:
        "Productos con tallas, colores y materiales: elige la combinación que quieres antes de pasar por caja.",
      cta: { label: "Mujeres", to: "/gender/women" },
      ctaSecondary: { label: "Buscar", to: "/search" },
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920",
      gradient: "from-teal-900/95 to-slate-900/85",
    },
    {
      id: 3,
      title: "Un solo carrito, pedidos claros",
      subtitle: "Cuenta, envío y pago",
      description:
        "Añade al carrito, revisa el pedido y sigue el estado desde tu cuenta cuando inicies sesión.",
      cta: { label: "Ir al catálogo", to: "/search" },
      ctaSecondary: { label: "Novedades", to: "/new-arrivals?sortBy=newest" },
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920",
      gradient: "from-slate-800/95 to-cyan-900/80",
    },
  ];

  return (
    <section className="hero-swiper relative h-[600px] overflow-hidden bg-slate-900 lg:h-[700px]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        pagination={{
          clickable: true,
          el: ".swiper-pagination-custom",
          bulletClass: "swiper-pagination-bullet-custom",
          bulletActiveClass: "swiper-pagination-bullet-active-custom",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop={true}
        speed={1000}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <div
                className={`absolute inset-0 bg-linear-to-r ${slide.gradient}`}
              >
                <img
                  src={slide.image}
                  alt=""
                  className="h-full w-full object-cover opacity-45"
                />
              </div>

              <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-block animate-fade-in rounded-full bg-white/15 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm">
                    NexWear
                  </div>

                  <h1 className="mb-4 animate-fade-in text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="mb-3 animate-fade-in text-xl font-semibold text-white/90 lg:text-2xl">
                    {slide.subtitle}
                  </p>

                  <p className="mb-8 max-w-xl animate-fade-in text-lg text-white/80">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-pagination-custom absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3" />

      <button
        type="button"
        className="swiper-button-prev-custom absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-all hover:bg-white/30 lg:block"
        aria-label="Anterior"
      >
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        type="button"
        className="swiper-button-next-custom absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-all hover:bg-white/30 lg:block"
        aria-label="Siguiente"
      >
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <style>{`
        .swiper-pagination-bullet-custom {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .swiper-pagination-bullet-custom:hover {
          background: rgba(255, 255, 255, 0.7);
        }
        
        .swiper-pagination-bullet-active-custom {
          width: 32px;
          background: white;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};
