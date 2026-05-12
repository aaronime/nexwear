import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import type { ProductFilters } from "@/admin/interfaces/getAllProductsResponse";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface AdminProductFormValues {
  name: string;
  description: string;
  price: number;
  brandId: string;
  categoryId: string;
  discountId: string;
  tagIds: string[];
  materialIds: string[];
  isActive?: boolean;
  isDeleted?: boolean;
}

interface Props {
  register: UseFormRegister<AdminProductFormValues>;
  control: Control<AdminProductFormValues>;
  errors: FieldErrors<AdminProductFormValues>;
  filters: ProductFilters;
  mode?: "create" | "edit";
}

export const AdminProductFormFields = ({
  register,
  control,
  errors,
  filters,
  mode = "create",
}: Props) => {
  const selectClass =
    "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="product-name">Nombre</Label>
        <Input
          id="product-name"
          autoComplete="off"
          aria-invalid={!!errors.name}
          {...register("name", { required: "El nombre es obligatorio" })}
        />
        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="product-description">Descripción</Label>
        <textarea
          id="product-description"
          rows={4}
          className={cn(
            "min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            errors.description && "border-destructive",
          )}
          aria-invalid={!!errors.description}
          {...register("description", {
            required: "La descripción es obligatoria",
          })}
        />
        {errors.description ? (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2 sm:max-w-xs">
        <Label htmlFor="product-price">Precio</Label>
        <Input
          id="product-price"
          type="number"
          step={0.01}
          min={0}
          aria-invalid={!!errors.price}
          {...register("price", {
            required: "Indica un precio",
            valueAsNumber: true,
            min: { value: 0, message: "Debe ser mayor o igual a 0" },
          })}
        />
        {errors.price ? (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="product-brand">Marca</Label>
          <select
            id="product-brand"
            className={selectClass}
            aria-invalid={!!errors.brandId}
            {...register("brandId", { required: "Elige una marca" })}
          >
            <option value="">— Marca —</option>
            {filters.brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          {errors.brandId ? (
            <p className="text-sm text-destructive">{errors.brandId.message}</p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="product-category">Categoría</Label>
          <select
            id="product-category"
            className={selectClass}
            aria-invalid={!!errors.categoryId}
            {...register("categoryId", { required: "Elige una categoría" })}
          >
            <option value="">— Categoría —</option>
            {filters.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId ? (
            <p className="text-sm text-destructive">
              {errors.categoryId.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 sm:max-w-md">
        <Label htmlFor="product-discount">Descuento (opcional)</Label>
        <select
          id="product-discount"
          className={selectClass}
          {...register("discountId")}
        >
          <option value="">Sin descuento</option>
          {filters.discounts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.percentage}%)
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label>Tags</Label>
        <Controller
          name="tagIds"
          control={control}
          render={({ field }) => (
            <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/50 p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                {filters.tags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      className="size-4 rounded border-input"
                      checked={field.value.includes(tag.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...field.value, tag.id]);
                        } else {
                          field.onChange(
                            field.value.filter((id: string) => id !== tag.id),
                          );
                        }
                      }}
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
              {filters.tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay tags.</p>
              ) : null}
            </div>
          )}
        />
      </div>

      <div className="grid gap-2">
        <Label>Materiales</Label>
        <Controller
          name="materialIds"
          control={control}
          render={({ field }) => (
            <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/50 p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                {filters.materials.map((mat) => (
                  <label
                    key={mat.id}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      className="size-4 rounded border-input"
                      checked={field.value.includes(mat.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...field.value, mat.id]);
                        } else {
                          field.onChange(
                            field.value.filter((id: string) => id !== mat.id),
                          );
                        }
                      }}
                    />
                    {mat.name}
                  </label>
                ))}
              </div>
              {filters.materials.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay materiales.
                </p>
              ) : null}
            </div>
          )}
        />
      </div>

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
        <p className="text-sm font-medium text-slate-800">Estado</p>
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-0.5 size-4 rounded border-input"
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                ref={field.ref}
              />
              <span>
                <span className="font-medium text-slate-900">Activo</span>
                <span className="mt-0.5 block text-slate-600">
                  Si está desmarcado, el producto no debería mostrarse en la
                  tienda.
                </span>
              </span>
            </label>
          )}
        />
        {mode === "edit" ? (
          <Controller
            name="isDeleted"
            control={control}
            render={({ field }) => (
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 rounded border-input"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
                <span>
                  <span className="font-medium text-slate-900">
                    Eliminado (soft delete)
                  </span>
                  <span className="mt-0.5 block text-slate-600">
                    Marca el registro como eliminado sin borrarlo del servidor.
                  </span>
                </span>
              </label>
            )}
          />
        ) : null}
      </div>
    </div>
  );
};
