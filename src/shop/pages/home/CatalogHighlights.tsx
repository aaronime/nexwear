import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { PackageSearch, Ruler, Shirt } from "lucide-react";

export const CatalogHighlights = () => {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-20 lg:py-28">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920')] bg-cover bg-center opacity-15" />

      <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-900/95 to-slate-950" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Tu catálogo NexWear
          </p>
          <h2 className="mb-6 text-3xl font-bold leading-tight text-white lg:text-4xl">
            Ropa y accesorios con{" "}
            <span className="bg-linear-to-r from-teal-300 to-cyan-200 bg-clip-text text-transparent">
              tallas, colores y materiales
            </span>{" "}
            reales
          </h2>
          <p className="mb-10 text-lg text-slate-300">
            Navega por género, filtra por marca, talla, color o etiquetas, y añade al carrito las
            variantes que elijas. Sin colecciones ficticias: solo lo que está en catálogo.
          </p>
        </div>

        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
              <Shirt className="size-5" aria-hidden />
            </div>
            <h3 className="mb-2 font-semibold text-white">Catálogo por género</h3>
            <p className="text-sm text-slate-400">
              Hombres, mujeres, unisex y niños, igual que en la barra de navegación.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
              <Ruler className="size-5" aria-hidden />
            </div>
            <h3 className="mb-2 font-semibold text-white">Variantes claras</h3>
            <p className="text-sm text-slate-400">
              Cada producto expone talla, color y stock para comprar con confianza.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
              <PackageSearch className="size-5" aria-hidden />
            </div>
            <h3 className="mb-2 font-semibold text-white">Búsqueda y filtros</h3>
            <p className="text-sm text-slate-400">
              Encuentra productos por texto y refina con filtros del listado.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="border-white/40 bg-white text-black hover:text-white hover:bg-white/10"
          >
            <Link to="/new-arrivals?sortBy=newest">Ver novedades</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
