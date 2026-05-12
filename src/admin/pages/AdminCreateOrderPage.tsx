import { useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useAdminCreateOrder } from "@/admin/hooks/useAdminCreateOrder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputs {
  userId: string;
  addressId: string;
  tax: string;
  shipping: string;
  discount: string;
  items: { productVariantId: string; quantity: string }[];
}

export const AdminCreateOrderPage = () => {
  const navigate = useNavigate();
  const createOrder = useAdminCreateOrder();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      userId: "",
      addressId: "",
      tax: "0",
      shipping: "0",
      discount: "0",
      items: [{ productVariantId: "", quantity: "1" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (data: FormInputs) => {
    const tax = Number(data.tax);
    const shipping = Number(data.shipping);
    const discount = Number(data.discount);
    if (
      data.items.length === 0 ||
      data.items.some((i) => !i.productVariantId.trim())
    ) {
      toast.error("Artículos incompletos", {
        description: "Añade al menos una variante con cantidad válida.",
      });
      return;
    }

    try {
      await createOrder.mutateAsync({
        userId: data.userId.trim(),
        addressId: data.addressId.trim(),
        tax: Number.isFinite(tax) ? tax : 0,
        shipping: Number.isFinite(shipping) ? shipping : 0,
        discount: Number.isFinite(discount) ? discount : 0,
        items: data.items.map((i) => ({
          productVariantId: i.productVariantId.trim(),
          quantity: Math.max(1, Math.floor(Number(i.quantity)) || 1),
        })),
      });
      toast.success("Pedido creado", {
        description: "El pedido se registró correctamente.",
      });
      navigate("/admin/orders", { replace: true });
    } catch {
      toast.error("No se pudo crear el pedido", {
        description: "Revisa los datos y la conexión.",
      });
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-slate-200 bg-white px-6 py-6 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Button
            variant="ghost"
            className="mb-4 -ml-2 gap-2 px-2 text-slate-600"
            asChild
          >
            <Link to="/admin/orders">
              <ArrowLeft className="size-4" aria-hidden />
              Volver a pedidos
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Nuevo pedido
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Crea un pedido desde administración (mismo cuerpo que el checkout:
            usuario, dirección, líneas e importes).
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8 sm:px-8">
        <form
          className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="co-userId">ID de usuario</Label>
              <Input
                id="co-userId"
                placeholder="uuid del cliente"
                {...register("userId", { required: "Obligatorio" })}
              />
              {errors.userId ? (
                <p className="text-sm text-destructive">{errors.userId.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="co-addressId">ID de dirección</Label>
              <Input
                id="co-addressId"
                placeholder="uuid de la dirección de envío"
                {...register("addressId", { required: "Obligatorio" })}
              />
              {errors.addressId ? (
                <p className="text-sm text-destructive">
                  {errors.addressId.message}
                </p>
              ) : null}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-slate-900">
              Líneas del pedido
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Variante de producto y cantidad por línea.
            </p>
            <ul className="mt-4 space-y-4">
              {fields.map((field, index) => (
                <li
                  key={field.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-end"
                >
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor={`variant-${field.id}`}>
                      ID variante de producto
                    </Label>
                    <Input
                      id={`variant-${field.id}`}
                      placeholder="uuid de productVariant"
                      {...register(`items.${index}.productVariantId`, {
                        required: "Obligatorio",
                      })}
                    />
                  </div>
                  <div className="grid w-full gap-2 sm:w-32">
                    <Label htmlFor={`qty-${field.id}`}>Cantidad</Label>
                    <Input
                      id={`qty-${field.id}`}
                      type="number"
                      min={1}
                      {...register(`items.${index}.quantity`, {
                        required: "Obligatorio",
                      })}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-red-600 hover:bg-red-50 hover:text-red-800"
                    disabled={fields.length <= 1}
                    onClick={() => remove(index)}
                    aria-label="Quitar línea"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 gap-1"
              onClick={() =>
                append({ productVariantId: "", quantity: "1" })
              }
            >
              <Plus className="size-4" aria-hidden />
              Añadir línea
            </Button>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="co-tax">Impuestos</Label>
              <Input
                id="co-tax"
                type="number"
                step="0.01"
                min={0}
                {...register("tax")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="co-shipping">Envío</Label>
              <Input
                id="co-shipping"
                type="number"
                step="0.01"
                min={0}
                {...register("shipping")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="co-discount">Descuento</Label>
              <Input
                id="co-discount"
                type="number"
                step="0.01"
                min={0}
                {...register("discount")}
              />
            </div>
          </section>

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
            <Button
              type="submit"
              disabled={createOrder.isPending}
              className="min-w-40"
            >
              {createOrder.isPending ? "Creando…" : "Crear pedido"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/admin/orders">Cancelar</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
