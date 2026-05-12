import { useMemo, useState } from "react";
import type { GetProductResponse } from "@/shop/interfaces/getProductResponse";
import type { Review } from "@/shop/interfaces/productReviewsResponse";
import { useProductReviews } from "@/shop/hooks/useProductReviews";
import { ProductStorePolicy } from "./ProductStorePolicy";
import { cn } from "@/lib/utils";

interface Props {
  product: GetProductResponse;
}

type ProductTab = "description" | "reviews" | "shipping";

const formatReviewDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" });
};

const clampScore = (score: number): number => {
  const n = Math.round(Number(score));
  if (Number.isNaN(n)) return 0;
  return Math.min(5, Math.max(0, n));
};

const reviewerLabel = (review: Review): string => {
  const id = review.userId?.trim();
  if (!id) return "Cliente";
  const tail = id.length > 4 ? id.slice(-4) : id;
  return `Usuario ····${tail}`;
};

export const ProductTabs = ({ product }: Props) => {
  const [activeTab, setActiveTab] = useState<ProductTab>("description");

  const {
    reviews,
    total: reviewsTotal,
    pages: reviewsPages,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useProductReviews(product.id);

  const reviewTotal =
    reviewsTotal > 0 ? reviewsTotal : (product.reviewCount ?? reviews.length);

  const averageDisplay = useMemo(() => {
    if (product.averageRating != null && product.averageRating > 0) {
      return product.averageRating;
    }
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + clampScore(r.score), 0) / reviews.length;
  }, [product.averageRating, reviews]);

  const ratingBuckets = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0];
    for (const r of reviews) {
      const star = clampScore(r.score);
      if (star >= 1 && star <= 5) {
        buckets[star - 1] += 1;
      }
    }
    return buckets;
  }, [reviews]);

  const maxBucket = useMemo(
    () => Math.max(1, ...ratingBuckets),
    [ratingBuckets],
  );

  const tabBtnClass = (tab: ProductTab) =>
    cn(
      "border-b-2 pb-4 text-sm font-semibold transition-colors",
      activeTab === tab
        ? "border-slate-900 text-slate-900"
        : "border-transparent text-slate-600 hover:text-slate-900",
    );

  return (
    <div className="mt-16 border-t border-slate-200 pt-16">
      <div className="mb-8 flex flex-wrap gap-6 border-b border-slate-200" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "description"}
          className={tabBtnClass("description")}
          onClick={() => setActiveTab("description")}
        >
          Descripción
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "reviews"}
          className={tabBtnClass("reviews")}
          onClick={() => setActiveTab("reviews")}
        >
          Reseñas ({reviewTotal})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "shipping"}
          className={tabBtnClass("shipping")}
          onClick={() => setActiveTab("shipping")}
        >
          Envío &amp; devoluciones
        </button>
      </div>

      <div role="tabpanel" className="min-h-48">
        {activeTab === "description" ? (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="mb-4 text-xl font-bold text-slate-900">Descripción</h3>
              <p className="text-slate-700">{product.description}</p>
            </div>
            {(product.brand || product.category || product.materials.length > 0) && (
              <div>
                <h4 className="mb-3 text-lg font-semibold text-slate-900">Datos del producto</h4>
                <ul className="space-y-2 text-slate-700">
                  {product.brand && (
                    <li>
                      <span className="font-medium text-slate-900">Marca:</span>{" "}
                      {product.brand.name}
                    </li>
                  )}
                  {product.category && (
                    <li>
                      <span className="font-medium text-slate-900">Categoría:</span>{" "}
                      {product.category.name}
                    </li>
                  )}
                  {product.materials.length > 0 && (
                    <li>
                      <span className="font-medium text-slate-900">Materiales:</span>{" "}
                      {product.materials.map((m) => m.name).join(", ")}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ) : null}

        {activeTab === "reviews" ? (
          <div className="max-w-3xl">
            <h3 className="mb-6 text-xl font-bold text-slate-900">Reseñas de clientes</h3>

            {isReviewsError ? (
              <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                No se pudieron cargar las reseñas. Intenta de nuevo más tarde.
              </p>
            ) : null}

            {isReviewsLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-32 rounded-xl bg-slate-100" />
                <div className="h-24 rounded-xl bg-slate-100" />
                <div className="h-24 rounded-xl bg-slate-100" />
              </div>
            ) : (
              <>
                <div className="mb-6 rounded-xl bg-slate-50 p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="text-5xl font-bold text-slate-900">
                      {reviewTotal > 0 ? averageDisplay.toFixed(1) : "—"}
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.round(Math.min(5, Math.max(0, averageDisplay)))
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-200 text-slate-200"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-slate-600">
                        {reviewTotal > 0
                          ? `Basado en ${reviewTotal} ${reviewTotal === 1 ? "reseña" : "reseñas"}`
                          : "Aún no hay reseñas"}
                      </p>
                    </div>
                  </div>

                  {reviews.length > 0 && (
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingBuckets[star - 1];
                        const widthPct = (count / maxBucket) * 100;
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <span className="w-8 text-sm text-slate-700">{star}★</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full bg-amber-400"
                                style={{ width: `${widthPct}%` }}
                              />
                            </div>
                            <span className="w-12 text-right text-sm text-slate-600">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-600">
                      Este producto aún no tiene reseñas públicas.
                    </p>
                  ) : (
                    reviews.map((review) => {
                      const stars = clampScore(review.score);
                      return (
                        <div key={review.id} className="rounded-xl border border-slate-200 p-6">
                          <div className="mb-3 flex items-start justify-between gap-4">
                            <div>
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-slate-900">
                                  {reviewerLabel(review)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < stars
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-slate-200 text-slate-200"
                                    }`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <span className="shrink-0 text-sm text-slate-500">
                              {formatReviewDate(review.createdAt)}
                            </span>
                          </div>
                          <p className="text-slate-700">{review.comment}</p>
                        </div>
                      );
                    })
                  )}
                </div>

                {reviewsPages > 1 ? (
                  <p className="mt-6 text-center text-sm text-slate-500">
                    Mostrando la primera página de reseñas ({reviews.length} de {reviewsTotal}).
                  </p>
                ) : null}
              </>
            )}
          </div>
        ) : null}

        {activeTab === "shipping" ? (
          <div className="max-w-3xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Envío y devoluciones</h3>
            <p className="text-sm text-slate-600">
              Condiciones generales de la tienda NexWear. Si necesitas ayuda con un pedido concreto,
              revisa el detalle del pedido en tu cuenta o contacta con soporte.
            </p>
            <ProductStorePolicy />
          </div>
        ) : null}
      </div>
    </div>
  );
};
