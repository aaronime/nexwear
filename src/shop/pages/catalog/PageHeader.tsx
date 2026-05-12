interface Props {
  category?: string;
  subcategory?: string;
  searchQuery?: string | null;
  totalProducts?: number;
}

interface CategoryConfig {
  title: string;
  description: string;
  image: string;
  gradient: string;
  count: number;
}

const categoryConfigs: Record<string, Record<string, CategoryConfig>> = {
  gender: {
    men: {
      title: "Moda para Hombres",
      description: "Descubre nuestra selección de ropa premium diseñada para el hombre moderno",
      image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=1920",
      gradient: "from-blue-900 via-blue-800 to-slate-900",
      count: 240,
    },
    women: {
      title: "Moda para Mujeres",
      description: "Explora nuestra elegante colección femenina con las últimas tendencias",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920",
      gradient: "from-pink-900 via-rose-800 to-slate-900",
      count: 320,
    },
    unisex: {
      title: "Moda Unisex",
      description: "Piezas versátiles diseñadas para todos los estilos y personalidades",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1920",
      gradient: "from-purple-900 via-indigo-800 to-slate-900",
      count: 180,
    },
    kids: {
      title: "Moda para Niños",
      description: "Ropa cómoda y divertida para los más pequeños de la casa",
      image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=1920",
      gradient: "from-amber-900 via-orange-800 to-slate-900",
      count: 150,
    },
  },
  accessories: {
    all: {
      title: "Accesorios",
      description: "Complementos perfectos para completar tu look",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1920",
      gradient: "from-slate-900 via-slate-800 to-slate-900",
      count: 95,
    },
    bags: {
      title: "Bolsos y Mochilas",
      description: "Bolsos, mochilas y carteras para cada ocasión",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1920",
      gradient: "from-stone-900 via-slate-800 to-slate-900",
      count: 45,
    },
    shoes: {
      title: "Calzado",
      description: "Zapatillas, zapatos y sandalias para todos los estilos",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1920",
      gradient: "from-neutral-900 via-stone-800 to-slate-900",
      count: 78,
    },
  },
};

export const PageHeader = ({ category, subcategory, searchQuery, totalProducts }: Props) => {
  const config = category && subcategory 
    ? categoryConfigs[category]?.[subcategory] 
    : null;
  
  const isSearch = !!searchQuery;
  const title = isSearch 
    ? `Resultados para "${searchQuery}"` 
    : config?.title || "Novedades";
  
  const description = isSearch
    ? "Encuentra exactamente lo que buscas en nuestra colección completa"
    : config?.description || "Explora nuestra colección completa de productos";
  
  const image = config?.image || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920";
  const gradient = config?.gradient || "from-slate-900 via-slate-800 to-slate-900";
  const count = totalProducts || config?.count || 0;

  const breadcrumbText = isSearch 
    ? "Búsqueda" 
    : config?.title || "Novedades";

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${gradient} py-16`}>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url('${image}')` }}
      />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
          <a href="/" className="transition-colors hover:text-white">
            Inicio
          </a>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {category && (
            <>
              <span className="capitalize text-slate-300">{category}</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
          <span className="font-medium text-white">{breadcrumbText}</span>
        </nav>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-3 text-4xl font-bold text-white lg:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              {description}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span className="font-semibold text-white">{count}</span>
            <span>productos disponibles</span>
          </div>
        </div>
      </div>
    </div>
  );
};
