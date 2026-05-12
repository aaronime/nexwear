import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AdminProductFormFields,
  type AdminProductFormValues,
} from "@/admin/components/AdminProductFormFields";
import { useUpdateProduct } from "@/admin/hooks/useUpdateProduct";
import type { ProductFilters } from "@/admin/interfaces/getAllProductsResponse";
import type { GetProductResponse } from "@/shop/interfaces/getProductResponse";

interface Props {
  product: GetProductResponse;
  productId: string;
  filters: ProductFilters;
}

export const AdminProductDetailFormTab = ({
  product,
  productId,
  filters,
}: Props) => {
  const updateMutation = useUpdateProduct();

  const { register, control, handleSubmit, reset, formState } =
    useForm<AdminProductFormValues>({
      defaultValues: {
        name: "",
        description: "",
        price: 0,
        brandId: "",
        categoryId: "",
        discountId: "",
        tagIds: [],
        materialIds: [],
        isActive: true,
        isDeleted: false,
      },
    });

  const { errors, isDirty } = formState;

  useEffect(() => {
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      brandId: product.brand?.id ?? "",
      categoryId: product.category?.id ?? "",
      discountId: product.discount?.id ?? "",
      tagIds: product.tags?.map((t) => t.id) ?? [],
      materialIds: product.materials?.map((m) => m.id) ?? [],
      isActive: product.isActive ?? true,
      isDeleted: product.isDeleted ?? false,
    });
  }, [product, reset]);

  const onSubmit = async (data: AdminProductFormValues) => {
    try {
      await updateMutation.mutateAsync({
        productId,
        name: data.name.trim(),
        description: data.description.trim(),
        price: data.price,
        brandId: data.brandId,
        categoryId: data.categoryId,
        discountId: data.discountId || undefined,
        tagIds: data.tagIds,
        materialIds: data.materialIds,
        isActive: data.isActive,
        isDeleted: data.isDeleted,
      });
      toast.success("Producto actualizado");
    } catch {
      toast.error("No se pudo guardar", {
        description: "Revisa los datos o la conexión.",
      });
    }
  };

  const busy = updateMutation.isPending;

  return (
    <form
      className="mx-auto max-w-2xl space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <AdminProductFormFields
        register={register}
        control={control}
        errors={errors}
        filters={filters}
        mode="edit"
      />
      <Button type="submit" disabled={busy || !isDirty}>
        {busy ? "Guardando…" : "Guardar cambios"}
      </Button>
    </form>
  );
};
