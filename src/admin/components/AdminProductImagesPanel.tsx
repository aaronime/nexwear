import { useState } from "react";
import { useForm } from "react-hook-form";
import { ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductImages } from "@/admin/hooks/useProductImages";
import { useCreateProductImage } from "@/admin/hooks/useCreateProductImage";
import { useUpdateProductImage } from "@/admin/hooks/useUpdateProductImage";
import { useDeleteProductImage } from "@/admin/hooks/useDeleteProductImage";
import type { ProductImage } from "@/admin/interfaces/getAllProductsResponse";

interface ImageFormValues {
  url: string;
  order: number;
}

interface Props {
  productId: string;
}

export const AdminProductImagesPanel = ({ productId }: Props) => {
  const { data: images = [], isLoading, isError, refetch } =
    useProductImages(productId);

  const createMutation = useCreateProductImage();
  const updateMutation = useUpdateProductImage();
  const deleteMutation = useDeleteProductImage();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ProductImage | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ImageFormValues>({
    defaultValues: { url: "", order: 0 },
  });

  const openCreate = () => {
    setEditingImage(null);
    const nextOrder =
      images.length === 0
        ? 0
        : Math.max(...images.map((i) => i.order)) + 1;
    reset({ url: "", order: nextOrder });
    setModalOpen(true);
  };

  const openEdit = (img: ProductImage) => {
    setEditingImage(img);
    reset({ url: img.url, order: img.order });
    setModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) setEditingImage(null);
  };

  const onSubmitImage = async (data: ImageFormValues) => {
    const url = data.url.trim();
    if (!url) {
      toast.error("La URL es obligatoria");
      return;
    }
    try {
      if (editingImage) {
        await updateMutation.mutateAsync({
          productImageId: editingImage.id,
          productId,
          url,
          order: data.order,
        });
        toast.success("Imagen actualizada");
      } else {
        await createMutation.mutateAsync({
          productId,
          url,
          order: data.order,
        });
        toast.success("Imagen añadida");
      }
      handleModalOpenChange(false);
    } catch {
      toast.error("No se pudo guardar la imagen");
    }
  };

  const openDelete = (img: ProductImage) => {
    setImageToDelete(img);
    setDeleteOpen(true);
  };

  const handleDeleteOpenChange = (open: boolean) => {
    setDeleteOpen(open);
    if (!open) setImageToDelete(null);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;
    try {
      await deleteMutation.mutateAsync({
        productImageId: imageToDelete.id,
        productId,
      });
      toast.success("Imagen eliminada");
      handleDeleteOpenChange(false);
    } catch {
      toast.error("No se pudo eliminar");
    }
  };

  const imageBusy =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50/40 p-6 text-center text-sm">
        No se pudieron cargar las imágenes.
        <Button className="mt-4" variant="outline" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  const sorted = [...images].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <Dialog open={modalOpen} onOpenChange={handleModalOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingImage ? "Editar imagen" : "Nueva imagen"}
            </DialogTitle>
            <DialogDescription>
              URL pública de la imagen y orden en la galería (0 = primero).
            </DialogDescription>
          </DialogHeader>
          <form
            id="admin-product-image-form"
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmitImage)}
          >
            <div className="grid gap-2">
              <Label htmlFor="img-url">URL</Label>
              <Input
                id="img-url"
                type="url"
                placeholder="https://…"
                {...register("url", { required: "URL obligatoria" })}
              />
              {errors.url ? (
                <p className="text-sm text-destructive">{errors.url.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="img-order">Orden</Label>
              <Input
                id="img-order"
                type="number"
                step={1}
                min={0}
                {...register("order", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Mínimo 0" },
                })}
              />
              {errors.order ? (
                <p className="text-sm text-destructive">
                  {errors.order.message}
                </p>
              ) : null}
            </div>
          </form>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={imageBusy}
              onClick={() => handleModalOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="admin-product-image-form"
              disabled={imageBusy}
            >
              {imageBusy ? "Guardando…" : editingImage ? "Guardar" : "Añadir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={handleDeleteOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar esta imagen?</DialogTitle>
            <DialogDescription>
              {imageToDelete ? (
                <>
                  Se quitará la imagen en orden{" "}
                  <span className="font-medium">{imageToDelete.order}</span> del
                  producto.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={deleteMutation.isPending}
              onClick={() => handleDeleteOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => void confirmDelete()}
            >
              {deleteMutation.isPending ? "Eliminando…" : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Galería del producto. La primera suele usarse como portada en el
          catálogo.
        </p>
        <Button
          type="button"
          size="sm"
          className="gap-1"
          onClick={openCreate}
        >
          <Plus className="size-4" aria-hidden />
          Nueva imagen
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 py-14">
          <ImageIcon className="size-10 text-slate-400" strokeWidth={1.25} />
          <p className="mt-3 text-sm font-medium text-slate-800">
            Sin imágenes
          </p>
          <Button className="mt-4" variant="secondary" onClick={openCreate}>
            Añadir imagen
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((img) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="aspect-square bg-slate-100">
                <img
                  src={img.url}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <span className="text-xs text-slate-500">Orden {img.order}</span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 px-2"
                    onClick={() => openEdit(img)}
                  >
                    <Pencil className="size-3.5" aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8 gap-1 px-2"
                    disabled={deleteMutation.isPending}
                    onClick={() => openDelete(img)}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
