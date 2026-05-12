import { useParams, useSearchParams } from "react-router";
import { PageHeader } from "./PageHeader";
import { Filters } from "./Filters";
import { ProductGrid } from "./ProductGrid";
import { useProducts } from "@/shop/hooks/useProducts";

export const CatalogPage = () => {
  const { genderId } = useParams();
  const [searchParams] = useSearchParams();
  
  const searchQuery = searchParams.get("q");
  
  const filters = {
    search: searchQuery || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    brandId: searchParams.get("brandId") || undefined,
    colorId: searchParams.get("colorId") || undefined,
    sizeId: searchParams.get("sizeId") || undefined,
    materialId: searchParams.get("materialId") || undefined,
    tagId: searchParams.get("tagId") || undefined,
    discountId: searchParams.get("discountId") || undefined,
    gender: genderId ? String(genderId).toUpperCase() : searchParams.get("gender") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    inStock: searchParams.get("inStock") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    page: searchParams.get("page") || undefined,
    limit: searchParams.get("limit") || undefined,
  };
  
  const { products, pagination, productFilters, filters: selectedFilters, isLoading, isError } = useProducts(filters);

  return (
    <>
      <PageHeader 
        subcategory={genderId}
        category={genderId ? "gender" : undefined}
        searchQuery={searchQuery}
        totalProducts={pagination.total}
      />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <Filters 
              category={genderId ? "gender" : undefined}
              productFilters={productFilters}
              selectedFilters={selectedFilters}
            />
          </aside>
          
          <div className="lg:col-span-3">
            <ProductGrid 
              products={products}
              pagination={pagination}
              isLoading={isLoading}
              isError={isError}
            />
          </div>
        </div>
      </main>
    </>
  );
};
