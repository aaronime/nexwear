import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  MessageSquareText,
  Pencil,
  Trash2,
} from "lucide-react";
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
import { useAdminProductReviews } from "@/admin/hooks/useAdminProductReviews";
import { useUpdateAdminReview } from "@/admin/hooks/useUpdateAdminReview";
import { useDeleteAdminReview } from "@/admin/hooks/useDeleteAdminReview";
import type { Review } from "@/shop/interfaces/productReviewsResponse";
import { cn } from "@/lib/utils";

interface Props {
  productId: string;
}

const formatReviewDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const AdminProductReviewsPanel = ({ productId }: Props) => {
  const { data, isLoading, isError, refetch } = useAdminProductReviews(productId);
  const updateMutation = useUpdateAdminReview(productId);
  const deleteMutation = useDeleteAdminReview(productId);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Review | null>(null);

  useEffect(() => {
    if (editing && editOpen) {
      setScore(Math.min(5, Math.max(1, Math.round(editing.score))));
      setComment(editing.comment);
      setIsVisible(editing.isVisible);
    }
  }, [editing, editOpen]);

  const openEdit = (r: Review) => {
    setEditing(r);
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    const trimmed = comment.trim();
    if (!trimmed) {
      toast.error("El comentario no puede estar vacío");
      return;
    }
    try {
      await updateMutation.mutateAsync({
        reviewId: editing.id,
        body: {
          productId,
          score,
          comment: trimmed,
          isVisible,
        },
      });
      toast.success("Reseña actualizada");
      setEditOpen(false);
      setEditing(null);
    } catch {
      toast.error("No se pudo guardar la reseña");
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteMutation.mutateAsync(toDelete.id);
      toast.success("Reseña eliminada");
      setDeleteOpen(false);
      setToDelete(null);
    } catch {
      toast.error("No se pudo eliminar la reseña");
    }
  };

  const reviews = data?.reviews ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-slate-200 bg-white p-8">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
        <span className="sr-only">Cargando reseñas</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50/50 p-8 text-center">
        <p className="text-sm font-medium text-slate-900">Error al cargar reseñas</p>
        <Button className="mt-4" variant="outline" size="sm" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Reseñas del producto</h2>
          <p className="mt-1 text-sm text-slate-600">
            {data?.total ?? reviews.length} en total
            {data && data.pages > 1 ? ` · página ${data.page} de ${data.pages}` : ""}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
          Actualizar
        </Button>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-14 text-center">
          <MessageSquareText className="size-10 text-slate-300" aria-hidden />
          <p className="mt-3 text-sm font-medium text-slate-700">
            No hay reseñas para este producto
          </p>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            Las valoraciones de clientes aparecerán aquí cuando existan en el sistema.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/90 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">Nota</th>
                  <th className="px-4 py-3">Comentario</th>
                  <th className="px-4 py-3">Visibilidad</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="max-w-[140px] px-4 py-3">
                      <span className="block truncate font-mono text-xs text-slate-700">
                        {r.userId}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums text-slate-900">
                      {r.score}/5
                    </td>
                    <td className="max-w-md px-4 py-3 text-slate-700">
                      <span className="line-clamp-2" title={r.comment}>
                        {r.comment}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                          r.isVisible
                            ? "bg-emerald-50 text-emerald-800 ring-emerald-600/20"
                            : "bg-slate-100 text-slate-600 ring-slate-500/20",
                        )}
                      >
                        {r.isVisible ? (
                          <Eye className="size-3" aria-hidden />
                        ) : (
                          <EyeOff className="size-3" aria-hidden />
                        )}
                        {r.isVisible ? "Visible" : "Oculta"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {formatReviewDate(r.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-slate-600 hover:text-slate-900"
                          aria-label="Editar reseña"
                          onClick={() => openEdit(r)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          aria-label="Eliminar reseña"
                          onClick={() => {
                            setToDelete(r);
                            setDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar reseña</DialogTitle>
            <DialogDescription>
              Moderación: nota, texto y si la reseña se muestra en la tienda.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="admin-review-score">Puntuación (1–5)</Label>
              <Input
                id="admin-review-score"
                type="number"
                min={1}
                max={5}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-review-comment">Comentario</Label>
              <textarea
                id="admin-review-comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="admin-review-visible"
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              />
              <Label htmlFor="admin-review-visible" className="font-normal text-slate-700">
                Visible en la tienda
              </Label>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-slate-900 hover:bg-slate-800"
              onClick={() => void handleSaveEdit()}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Guardando…" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar reseña</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. ¿Eliminar la reseña del usuario{" "}
              <span className="font-mono text-xs">{toDelete?.userId}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleDelete()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Eliminando…" : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
