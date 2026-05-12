import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { searchProducts } from "../actions/search-products.action";
import type { ProductListItem } from "@/shop/interfaces/getProductsResonse";

interface SearchBarProps {
  /** Cierra paneles móviles al navegar tras buscar o elegir un resultado. */
  onNavigate?: () => void;
}

export const SearchBar = ({ onNavigate }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductListItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [currentTimeout, setCurrentTimeout] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchProducts(query);
        setResults(data.products);
        setIsOpen(data.products.length > 0);
      } catch (error) {
        console.error("Error searching products:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 2000);


    setCurrentTimeout(timer);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
    
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      onNavigate?.();
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setQuery("");
    setIsOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={searchRef} className="relative w-full sm:w-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition-colors focus-within:border-slate-900 focus-within:bg-white">
          <svg
            className="h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none sm:w-40 lg:w-60"
          />
          {isLoading && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"></div>
          )}
        </div>
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl sm:left-auto sm:w-96">
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Resultados
            </p>
            {results.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-slate-50"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <img
                    src={
                      product.firstImage?.url ||
                      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"
                    }
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  {product.brand && (
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                      {product.brand.name}
                    </p>
                  )}
                  <h4 className="truncate text-sm font-semibold text-slate-900">
                    {product.name}
                  </h4>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      ${product.finalPrice.toFixed(2)}
                    </span>
                    {product.discount && (
                      <span className="text-xs text-slate-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {product.reviewCount > 0 && (
                    <div className="mt-1 flex items-center gap-1">
                      <svg
                        className="h-3 w-3 fill-amber-400 text-amber-400"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs text-slate-600">
                        {product.averageRating.toFixed(1)} ({product.reviewCount})
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="border-t border-slate-200 p-3">
            <button
              onClick={handleSubmit}
              className="w-full rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Ver todos los resultados para "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
