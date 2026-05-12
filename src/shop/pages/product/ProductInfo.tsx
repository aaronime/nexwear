import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type {
  Color,
  GetProductResponse,
  Size,
} from "@/shop/interfaces/getProductResponse";
import { useAddToCart } from "@/shop/hooks/useAddToCart";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { toast } from "sonner";
import { ProductStorePolicy } from "./ProductStorePolicy";

interface Props {
  product: GetProductResponse;
}

interface UniqueColor {
  id: string;
  name: string;
  hex: string;
  colorIds: string[];
}

interface UniqueSize {
  id: string;
  name: string;
  sizeIds: string[];
}

function buildUniqueColors(colors: Color[]): UniqueColor[] {
  const byKey = new Map<string, UniqueColor>();
  for (const c of colors) {
    const key = `${c.name.trim().toLowerCase()}|${c.hex.trim().toLowerCase()}`;
    const prev = byKey.get(key);
    if (prev) {
      if (!prev.colorIds.includes(c.id)) prev.colorIds.push(c.id);
    } else {
      byKey.set(key, {
        id: c.id,
        name: c.name,
        hex: c.hex,
        colorIds: [c.id],
      });
    }
  }
  return Array.from(byKey.values());
}

function buildUniqueSizes(sizes: Size[]): UniqueSize[] {
  const byKey = new Map<string, UniqueSize>();
  for (const s of sizes) {
    const key = s.name.trim().toLowerCase();
    const prev = byKey.get(key);
    if (prev) {
      if (!prev.sizeIds.includes(s.id)) prev.sizeIds.push(s.id);
    } else {
      byKey.set(key, {
        id: s.id,
        name: s.name,
        sizeIds: [s.id],
      });
    }
  }
  return Array.from(byKey.values());
}

export const ProductInfo = ({ product }: Props) => {
  const averageRating = product.averageRating ?? 0;
  const reviewCount = product.reviewCount ?? product.reviews?.length ?? 0;
  const soldCount = product.soldCount ?? 0;

  const user = useAuthStore((state) => state.user);
  const { addToCart, isLoading: isAddingToCart } = useAddToCart();

  const uniqueColors = useMemo(
    () => buildUniqueColors(product.colors),
    [product.colors],
  );
  const uniqueSizes = useMemo(
    () => buildUniqueSizes(product.sizes),
    [product.sizes],
  );

  const [selectedColorId, setSelectedColorId] = useState<string>(() =>
    uniqueColors.length > 0 ? uniqueColors[0].id : "",
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string>(() =>
    uniqueSizes.length > 0 ? uniqueSizes[0].id : "",
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const uc = buildUniqueColors(product.colors);
    const us = buildUniqueSizes(product.sizes);
    const id = window.setTimeout(() => {
      setSelectedColorId(uc.length > 0 ? uc[0].id : "");
      setSelectedSizeId(us.length > 0 ? us[0].id : "");
      setQuantity(1);
    }, 0);
    return () => window.clearTimeout(id);
  }, [product.id, product.colors, product.sizes]);

  const selectedVariant = useMemo(() => {
    if (!selectedColorId && !selectedSizeId) return null;

    const colorIdsForSelection = uniqueColors.find(
      (c) => c.id === selectedColorId,
    )?.colorIds;
    const sizeIdsForSelection = uniqueSizes.find(
      (s) => s.id === selectedSizeId,
    )?.sizeIds;

    const variant = product.variants.find((v) => {
      const colorMatch =
        !selectedColorId ||
        !!(v.colorId && colorIdsForSelection?.includes(v.colorId));
      const sizeMatch =
        !selectedSizeId ||
        !!(v.sizeId && sizeIdsForSelection?.includes(v.sizeId));
      return colorMatch && sizeMatch;
    });

    return variant ?? null;
  }, [
    selectedColorId,
    selectedSizeId,
    product.variants,
    uniqueColors,
    uniqueSizes,
  ]);

  const calculateDiscountedPrice = () => {
    if (!product.discount) return product.price;
    return product.price - (product.price * product.discount.percentage) / 100;
  };

  const discountedPrice = calculateDiscountedPrice();
  const hasDiscount = product.discount && discountedPrice < product.price;

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Debes iniciar sesión para agregar productos al carrito", {
        position: "bottom-right",
      });
      return;
    }

    if (!selectedVariant) {
      toast.info("Por favor selecciona una variante del producto", {
        position: "bottom-right",
      });
      return;
    }

    addToCart(
      {
        productVariantId: selectedVariant.id,
        quantity,
      },
      {
        onSuccess: () => {
          setQuantity(1);
        },
      },
    );
  };

  const handleIncrement = () => {
    if (quantity < selectedVariant?.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const getSelectedColorName = () => {
    const color = uniqueColors.find((c) => c.id === selectedColorId);
    return color?.name || "";
  };

  const getSelectedSizeName = () => {
    const size = uniqueSizes.find((s) => s.id === selectedSizeId);
    return size?.name || "";
  };

  const handleSelectColor = (colorId: string) => {
    setQuantity(1);
    setSelectedColorId(colorId);
  };

  const handleSelectSize = (sizeId: string) => {
    setQuantity(1);
    setSelectedSizeId(sizeId);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {product.brand && (
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
              {product.brand.name}
            </span>
          )}
          {selectedVariant ? (
            <span
              className={
                selectedVariant.stock > 0
                  ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
                  : "rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
              }
            >
              {selectedVariant.stock > 0
                ? `${selectedVariant.stock} en stock`
                : "Sin stock en esta variante"}
            </span>
          ) : null}
          {product.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
            >
              {tag.name}
            </span>
          ))}
        </div>

        <h1 className="mb-3 text-3xl font-bold text-slate-900 lg:text-4xl">
          {product.name}
        </h1>

        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          {reviewCount > 0 ? (
            <>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(Math.min(5, Math.max(0, averageRating)))
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-200 text-slate-200"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm font-medium text-slate-700">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-slate-600">
                ({reviewCount} {reviewCount === 1 ? "reseña" : "reseñas"})
              </span>
            </>
          ) : (
            <span className="text-sm text-slate-500">Sin reseñas aún</span>
          )}
          {soldCount > 0 && (
            <>
              <span className="text-sm text-slate-600">|</span>
              <span className="text-sm font-medium text-slate-900">
                {soldCount >= 1000
                  ? `${(soldCount / 1000).toFixed(soldCount >= 10000 ? 0 : 1)}k+`
                  : soldCount}{" "}
                vendidos
              </span>
            </>
          )}
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-slate-900">
            ${discountedPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-2xl text-slate-500 line-through">
                ${product.price.toFixed(2)}
              </span>
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                Ahorra {product.discount!.percentage}%
              </span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-200 pt-6">
        {uniqueColors.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                Color:{" "}
                <span className="font-normal text-slate-700">
                  {getSelectedColorName()}
                </span>
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {uniqueColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleSelectColor(color.id)}
                  className={`group relative h-12 w-12 rounded-full border-2 transition-all hover:scale-110 ${
                    selectedColorId === color.id
                      ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2"
                      : "border-slate-300 hover:border-slate-900"
                  }`}
                  title={color.name}
                >
                  <div
                    className="h-full w-full rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {uniqueSizes.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                Talla:{" "}
                <span className="font-normal text-slate-700">
                  {getSelectedSizeName()}
                </span>
              </span>
            </div>
            <div className="grid grid-cols-8 gap-2">
              {uniqueSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => handleSelectSize(size.id)}
                  className={`rounded-lg border-2 py-3 text-sm font-medium transition-all ${
                    selectedSizeId === size.id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 text-slate-900 hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <span className="mb-3 block text-sm font-semibold text-slate-900">
            Cantidad
          </span>
          <div className="flex w-28 items-center overflow-hidden rounded-lg border-2 border-slate-300">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="flex h-12 w-14 items-center justify-center transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span className="h-12 w-full border-x-2 border-slate-300 text-center text-sm font-medium focus:outline-none flex items-center justify-center">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="flex h-12 w-14 items-center justify-center transition-colors hover:bg-slate-100"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 border-t border-slate-200 pt-6">
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={!selectedVariant || isAddingToCart}
          className="flex-1 bg-slate-900 text-white transition-all hover:scale-105 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex items-center justify-center gap-2">
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Agregar al Carrito
          </div>
        </Button>
      </div>

      <div className="space-y-3 border-t border-slate-200 pt-6">
        <ProductStorePolicy />
      </div>

      {(product.materials.length > 0 ||
        product.category ||
        selectedVariant?.sku) && (
        <div className="rounded-xl bg-slate-50 p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">
            Detalles del producto
          </h3>
          <ul className="space-y-2 text-sm text-slate-700">
            {product.materials.length > 0 && (
              <li className="flex items-start gap-2">
                <span className="text-slate-400">•</span>
                <span>
                  Materiales: {product.materials.map((m) => m.name).join(", ")}
                </span>
              </li>
            )}
            {product.category && (
              <li className="flex items-start gap-2">
                <span className="text-slate-400">•</span>
                <span>Categoría: {product.category.name}</span>
              </li>
            )}
            {selectedVariant?.sku ? (
              <li className="flex items-start gap-2">
                <span className="text-slate-400">•</span>
                <span>SKU: {selectedVariant.sku}</span>
              </li>
            ) : null}
          </ul>
        </div>
      )}
    </div>
  );
};
