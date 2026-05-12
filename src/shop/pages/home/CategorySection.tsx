import { Link } from "react-router";

interface CategoryTile {
  id: string;
  name: string;
  blurb: string;
  href: string;
  image: string;
  color: string;
}

const categories: CategoryTile[] = [
  {
    id: "new",
    name: "Novedades",
    blurb: "Lo más reciente del catálogo",
    href: "/new-arrivals?sortBy=newest",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea8a0319?w=800",
    color: "from-emerald-600/85 to-teal-700/85",
  },
  {
    id: "men",
    name: "Hombres",
    blurb: "Ver productos",
    href: "/gender/men",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800",
    color: "from-blue-600/85 to-slate-900/85",
  },
  {
    id: "women",
    name: "Mujeres",
    blurb: "Ver productos",
    href: "/gender/women",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
    color: "from-rose-600/85 to-pink-900/85",
  },
  {
    id: "unisex",
    name: "Unisex",
    blurb: "Ver productos",
    href: "/gender/unisex",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800",
    color: "from-violet-600/85 to-indigo-900/85",
  },
  {
    id: "kids",
    name: "Niños",
    blurb: "Ver productos",
    href: "/gender/kids",
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800",
    color: "from-amber-600/85 to-orange-900/85",
  },
];

export const CategorySection = () => {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-slate-900 lg:text-4xl">
            Empieza por aquí
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Mismas rutas que en el menú: novedades y catálogo por género. Sin promesas de stock
            ficticio, solo enlaces al listado real.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.href}
              className="group relative block h-72 overflow-hidden rounded-2xl outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
            >
              <img
                src={category.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div
                className={`absolute inset-0 bg-gradient-to-t ${category.color} transition-opacity duration-300 group-hover:opacity-95`}
              />

              <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                <h3 className="text-2xl font-bold">{category.name}</h3>
                <p className="mt-1 text-sm font-medium text-white/90">{category.blurb}</p>
                <span className="mt-3 inline-flex w-fit items-center rounded-full border border-white/60 px-4 py-1.5 text-xs font-semibold transition-colors group-hover:bg-white group-hover:text-slate-900">
                  Entrar
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
