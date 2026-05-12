import type { Brand } from "@/shop/interfaces/getProductsResonse";
import { Link } from "react-router";

interface Props {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  brand?: Brand;
  imageUrl: string;
  isNew?: boolean;
  averageRating?: number;
  reviewCount?: number;
}

export const ProductCard = ({ id, name, price, originalPrice, discount, brand, imageUrl, isNew, averageRating = 0, reviewCount = 0 }: Props) => {

  return (
    <Link to={`/product/${id}`} className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl">
      <div className="relative aspect-4/5 overflow-hidden bg-slate-100">
        <img 
          src={imageUrl} 
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        <div className="absolute left-4 top-4 flex gap-2">
          {isNew && (
            <div className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
              Nuevo
            </div>
          )}
          {brand && (
            <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
              {brand.name}
            </div>
          )}
        </div>
        
        {discount && (
          <div className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
            -{discount}%
          </div>
        )}
        
        {/* <div className="absolute inset-x-4 bottom-0 flex translate-y-full transition-transform group-hover:translate-y-[-20%]">
          <button className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 text-sm font-medium text-white transition-all hover:bg-slate-800">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Agregar al Carrito
          </button>
        </div> */}
      </div>
      
      <div className="p-4">
        <h3 className="mb-2 line-clamp-1 text-base font-semibold text-slate-900 transition-colors group-hover:text-slate-700">
          {name}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-900">
            ${price.toFixed(2)}
          </span>
          {discount && originalPrice && (
            <span className="text-sm text-slate-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {reviewCount > 0 && (
          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <svg 
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-300 text-slate-300"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-sm font-medium text-slate-700">
              ({averageRating.toFixed(1)})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};
