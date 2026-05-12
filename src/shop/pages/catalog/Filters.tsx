import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router";
import { SlidersHorizontal, X } from "lucide-react";
import type {
  ProductFilters,
  SelectedFilters,
} from "@/shop/interfaces/getProductsResonse";

interface Props {
  productFilters: ProductFilters;
  selectedFilters?: SelectedFilters;
  category?: string;
}

interface CatalogFilterSectionsProps {
  priceRadioName: string;
  categoryRoute?: string;
  productFilters: ProductFilters;
  selectedFilters?: SelectedFilters;
}

function getActiveFiltersFromSelection(
  selectedFilters: SelectedFilters | undefined,
  categoryRoute: string | undefined
): Array<{ key: string; value: string; label: string }> {
  if (!selectedFilters) return [];

  const {
    category,
    brand,
    color,
    size,
    material,
    tag,
    discount,
    minPrice,
    maxPrice,
    gender,
    inStock,
  } = selectedFilters;

  const active: Array<{ key: string; value: string; label: string }> = [];

  if (category) {
    active.push({
      key: "categoryId",
      value: category.id,
      label: category.name,
    });
  }

  if (brand) {
    active.push({
      key: "brandId",
      value: brand.id,
      label: brand.name,
    });
  }

  if (color) {
    active.push({
      key: "colorId",
      value: color.id,
      label: color.name,
    });
  }

  if (size) {
    active.push({
      key: "sizeId",
      value: size.id,
      label: size.name,
    });
  }

  if (material) {
    active.push({
      key: "materialId",
      value: material.id,
      label: material.name,
    });
  }

  if (tag) {
    active.push({
      key: "tagId",
      value: tag.id,
      label: tag.name,
    });
  }

  if (discount) {
    active.push({
      key: "discountId",
      value: discount.id,
      label: `${discount.name} (-${discount.percentage}%)`,
    });
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    active.push({
      key: "minPrice",
      value: minPrice.toString(),
      label: `$${minPrice.toFixed(0)} - $${maxPrice.toFixed(0)}`,
    });
  }

  if (gender && categoryRoute !== "gender") {
    const genderLabels: Record<string, string> = {
      MEN: "Hombres",
      WOMEN: "Mujeres",
      UNISEX: "Unisex",
      KIDS: "Niños",
    };
    active.push({
      key: "gender",
      value: gender,
      label: genderLabels[gender] || gender,
    });
  }

  if (inStock !== undefined) {
    active.push({
      key: "inStock",
      value: inStock.toString(),
      label: inStock ? "En stock" : "Sin stock",
    });
  }

  return active;
}

function CatalogFilterSections({
  priceRadioName,
  categoryRoute,
  productFilters,
  selectedFilters,
}: CatalogFilterSectionsProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const toggleFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const currentValue = newParams.get(key);

    if (currentValue === value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    newParams.delete("page");
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams();
    const searchQuery = searchParams.get("q");

    if (searchQuery) {
      newParams.set("q", searchQuery);
    }

    setSearchParams(newParams);
  };

  const isFilterActive = (key: string, value: string): boolean => {
    return searchParams.get(key) === value;
  };

  const removeFilter = (key: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);

    if (key === "minPrice" || key === "maxPrice") {
      newParams.delete("minPrice");
      newParams.delete("maxPrice");
    }

    newParams.delete("page");
    setSearchParams(newParams);
  };

  const activeFilters = getActiveFiltersFromSelection(
    selectedFilters,
    categoryRoute
  );

  const generatePriceRanges = () => {
    const { minPrice, maxPrice } = productFilters;

    if (minPrice === 0 && maxPrice === 0) {
      return [];
    }

    const ranges = [];
    const priceRange = maxPrice - minPrice;
    const rangeSize = Math.ceil(priceRange / 5);

    for (let i = 0; i < 5; i++) {
      const min = minPrice + rangeSize * i;
      const max = i === 4 ? maxPrice : minPrice + rangeSize * (i + 1);

      if (min < maxPrice) {
        ranges.push({
          label:
            i === 4
              ? `Más de $${min.toFixed(0)}`
              : `$${min.toFixed(0)} - $${max.toFixed(0)}`,
          min,
          max,
        });
      }
    }

    return ranges;
  };

  const priceRanges = generatePriceRanges();

  return (
    <>
      {activeFilters.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Filtros Activos
            </h3>
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              Limpiar todo
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <button
                type="button"
                key={`${filter.key}-${filter.value}`}
                onClick={() => removeFilter(filter.key)}
                className="group flex items-center gap-2 rounded-full border-2 border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-slate-800"
              >
                <span>{filter.label}</span>
                <svg
                  className="h-3.5 w-3.5 transition-transform group-hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {productFilters.categories.length > 0 &&
        !searchParams.get("categoryId") && (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
              Categorías
            </h3>
            <ul className="space-y-3">
              {productFilters.categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => toggleFilter("categoryId", cat.id)}
                    className={`flex w-full items-center justify-between text-sm transition-colors hover:text-slate-900 ${
                      isFilterActive("categoryId", cat.id)
                        ? "font-semibold text-slate-900"
                        : "text-slate-700"
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

      {priceRanges.length > 0 && !searchParams.get("minPrice") && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
            Precio
          </h3>
          <ul className="space-y-3">
            {priceRanges.map((range) => (
              <li key={range.label}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700 transition-colors hover:text-slate-900">
                  <input
                    type="radio"
                    name={priceRadioName}
                    checked={
                      searchParams.get("minPrice") === range.min.toString() &&
                      searchParams.get("maxPrice") === range.max.toString()
                    }
                    onChange={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set("minPrice", range.min.toString());
                      newParams.set("maxPrice", range.max.toString());
                      newParams.delete("page");
                      setSearchParams(newParams);
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900"
                  />
                  <span>{range.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {productFilters.sizes.length > 0 && !searchParams.get("sizeId") && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
            Talla
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {productFilters.sizes.map((sizeItem) => (
              <button
                type="button"
                key={sizeItem.id}
                onClick={() => toggleFilter("sizeId", sizeItem.id)}
                className={`rounded-lg border-2 py-2 text-sm font-medium transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white ${
                  isFilterActive("sizeId", sizeItem.id)
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 text-slate-900"
                }`}
              >
                {sizeItem.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {productFilters.colors.length > 0 && !searchParams.get("colorId") && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
            Color
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {productFilters.colors.map((color) => (
              <button
                type="button"
                key={color.id}
                onClick={() => toggleFilter("colorId", color.id)}
                className={`group relative h-10 w-10 rounded-full border-2 transition-all hover:scale-110 hover:border-slate-900 ${
                  isFilterActive("colorId", color.id)
                    ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2"
                    : "border-slate-300"
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

      {productFilters.brands.length > 0 && !searchParams.get("brandId") && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
            Marca
          </h3>
          <ul className="space-y-3">
            {productFilters.brands.map((brand) => (
              <li key={brand.id}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700 transition-colors hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={isFilterActive("brandId", brand.id)}
                    onChange={() => toggleFilter("brandId", brand.id)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900"
                  />
                  <span>{brand.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {productFilters.materials.length > 0 &&
        !searchParams.get("materialId") && (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
              Material
            </h3>
            <ul className="space-y-3">
              {productFilters.materials.map((material) => (
                <li key={material.id}>
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700 transition-colors hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={isFilterActive("materialId", material.id)}
                      onChange={() => toggleFilter("materialId", material.id)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900"
                    />
                    <span>{material.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

      {productFilters.tags.length > 0 && !searchParams.get("tagId") && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
            Etiquetas
          </h3>
          <div className="flex flex-wrap gap-2">
            {productFilters.tags.map((tag) => (
              <button
                type="button"
                key={tag.id}
                onClick={() => toggleFilter("tagId", tag.id)}
                className={`rounded-full border-2 px-3 py-1 text-xs font-medium transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white ${
                  isFilterActive("tagId", tag.id)
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 text-slate-900"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {productFilters.discounts.length > 0 &&
        !searchParams.get("discountId") && (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
              Descuentos
            </h3>
            <ul className="space-y-3">
              {productFilters.discounts.map((discount) => (
                <li key={discount.id}>
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700 transition-colors hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={isFilterActive("discountId", discount.id)}
                      onChange={() => toggleFilter("discountId", discount.id)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900"
                    />
                    <span>
                      {discount.name} (-{discount.percentage}%)
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
    </>
  );
}

export const Filters = ({
  category: categoryRoute,
  productFilters,
  selectedFilters,
}: Props) => {
  const [searchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const activeFilters = getActiveFiltersFromSelection(
    selectedFilters,
    categoryRoute
  );

  useEffect(() => {
    const id = window.setTimeout(() => {
      setIsMobileFiltersOpen(false);
    }, 0);
    return () => window.clearTimeout(id);
  }, [searchParams]);

  useEffect(() => {
    if (!isMobileFiltersOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobileFiltersOpen]);

  const sectionProps: CatalogFilterSectionsProps = {
    priceRadioName: "catalog-price-lg",
    categoryRoute,
    productFilters,
    selectedFilters,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Filtros</h2>
          {activeFilters.length > 0 ? (
            <p className="mt-0.5 text-xs text-slate-500">
              {activeFilters.length} activo
              {activeFilters.length === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex shrink-0 items-center gap-2 rounded-lg border-2 border-slate-300 px-3 py-2 text-sm font-medium text-slate-900 transition-all hover:border-slate-900 sm:px-4"
        >
          <SlidersHorizontal className="size-5 shrink-0" aria-hidden />
          <span>Filtrar</span>
          {activeFilters.length > 0 ? (
            <span className="flex min-w-6 items-center justify-center rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
              {activeFilters.length}
            </span>
          ) : null}
        </button>
      </div>

      <div className="hidden space-y-6 lg:block">
        <CatalogFilterSections {...sectionProps} />
      </div>

      {isMobileFiltersOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-100 flex flex-col bg-white lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-filters-title"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                <h2
                  id="mobile-filters-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  Filtros
                </h2>
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-slate-100"
                  aria-label="Cerrar filtros"
                >
                  <X className="size-5 text-slate-700" aria-hidden />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="space-y-6 px-4 py-4 pb-10">
                  <CatalogFilterSections
                    {...sectionProps}
                    priceRadioName="catalog-price-mobile"
                  />
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
};
