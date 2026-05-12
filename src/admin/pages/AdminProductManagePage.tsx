import { Link, useParams } from "react-router";
import { ArrowLeft, Shirt } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAdminProductDetail } from "@/admin/hooks/useAdminProductDetail";
import { useAdminProductFilters } from "@/admin/hooks/useAdminProductFilters";
import { AdminProductDetailFormTab } from "@/admin/components/AdminProductDetailFormTab";
import { AdminProductVariantsPanel } from "@/admin/components/AdminProductVariantsPanel";
import { AdminProductImagesPanel } from "@/admin/components/AdminProductImagesPanel";
import { AdminProductReviewsPanel } from "@/admin/components/AdminProductReviewsPanel";
import { formatMoney } from "@/shop/lib/order-display";
import { cn } from "@/lib/utils";

export const AdminProductManagePage = () => {
  const { productId } = useParams<{ productId: string }>();
  const id = productId ?? "";

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useAdminProductDetail(id);
  const {
    data: filters,
    isLoading: filtersLoading,
    isError: filtersError,
    refetch: refetchFilters,
  } = useAdminProductFilters();

  if (!productId) {
    return (
      <div className="p-8">
        <p className="text-sm text-slate-600">Producto no especificado.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/admin/products">Volver al listado</Link>
        </Button>
      </div>
    );
  }

  if (isLoading || (filtersLoading && !filters)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
        <span className="sr-only">Cargando producto</span>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-lg rounded-xl border border-red-100 bg-red-50/40 p-8 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            No pudimos cargar el producto
          </h1>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              Reintentar
            </Button>
            <Button asChild variant="secondary">
              <Link to="/admin/products">Volver</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (filtersError || !filters) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-lg rounded-xl border border-red-100 bg-red-50/40 p-8 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            No pudimos cargar filtros del catálogo
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Necesarios para editar el producto.
          </p>
          <Button className="mt-6" variant="outline" onClick={() => refetchFilters()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white px-6 py-6 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-4 gap-1 text-slate-600"
          >
            <Link to="/admin/products">
              <ArrowLeft className="size-4" aria-hidden />
              Productos
            </Link>
          </Button>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-violet-700">
                <Shirt className="size-4" aria-hidden />
                {product.brand?.name ?? "Sin marca"}
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {product.name}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Precio base:{" "}
                <span className="font-semibold text-slate-800">
                  {formatMoney(product.price)}
                </span>
                {product.discount ? (
                  <>
                    {" "}
                    · Descuento: {product.discount.name} (
                    {product.discount.percentage}%)
                  </>
                ) : null}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                    (product.isActive ?? true)
                      ? "bg-emerald-50 text-emerald-800 ring-emerald-600/20"
                      : "bg-slate-100 text-slate-700 ring-slate-500/15",
                  )}
                >
                  Activo: {(product.isActive ?? true) ? "Sí" : "No"}
                </span>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                    (product.isDeleted ?? false)
                      ? "bg-red-50 text-red-800 ring-red-600/20"
                      : "bg-slate-100 text-slate-700 ring-slate-500/15",
                  )}
                >
                  Eliminado: {(product.isDeleted ?? false) ? "Sí" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8">
        <Tabs orientation="horizontal" defaultValue="details" className="gap-6">
          <TabsList variant="line" className="w-full max-w-3xl flex-wrap justify-start">
            <TabsTrigger value="details">Datos</TabsTrigger>
            <TabsTrigger value="variants">Variantes</TabsTrigger>
            <TabsTrigger value="images">Imágenes</TabsTrigger>
            <TabsTrigger value="reviews">Reseñas</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="pt-2">
            <AdminProductDetailFormTab
              product={product}
              productId={id}
              filters={filters}
            />
          </TabsContent>
          <TabsContent value="variants" className="pt-2">
            <AdminProductVariantsPanel productId={id} filters={filters} />
          </TabsContent>
          <TabsContent value="images" className="pt-2">
            <AdminProductImagesPanel productId={id} />
          </TabsContent>
          <TabsContent value="reviews" className="pt-2">
            <AdminProductReviewsPanel productId={id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
