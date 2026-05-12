import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreateReview } from "@/shop/hooks/useCreateReview";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  productId: string;
  productName: string;
}

export const OrderProductReviewDialog = ({
  open,
  onOpenChange,
  userId,
  productId,
  productName,
}: Props) => {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const { createReview, isLoading } = useCreateReview();

  useEffect(() => {
    if (open) {
      setScore(5);
      setComment("");
    }
  }, [open, productId]);

  const handleSubmit = async () => {
    const trimmed = comment.trim();
    if (!trimmed) {
      toast.info("Escribe un comentario para tu reseña", { position: "bottom-right" });
      return;
    }

    try {
      await createReview({
        userId,
        productId,
        score,
        comment: trimmed,
        isVisible: true,
      });
      toast.success("Gracias por tu reseña", { position: "bottom-right" });
      setComment("");
      setScore(5);
      onOpenChange(false);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 409) {
        toast.error("Ya existe una reseña tuya para este producto", {
          position: "bottom-right",
        });
        return;
      }
      toast.error("No se pudo enviar la reseña. Intenta de nuevo.", {
        position: "bottom-right",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Valorar producto</DialogTitle>
          <DialogDescription>
            Tu opinión sobre <span className="font-medium text-slate-800">{productName}</span>.
            Una sola reseña por producto en este pedido.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-slate-900">Puntuación</Label>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setScore(n)}
                  className="rounded p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  aria-label={`${n} estrellas`}
                >
                  <Star
                    className={cn(
                      "size-9",
                      n <= score
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-200 text-slate-200",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="review-comment" className="text-slate-900">
              Comentario
            </Label>
            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(ev) => setComment(ev.target.value)}
              placeholder="Cuéntanos qué te pareció el producto…"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-slate-900 hover:bg-slate-800"
            onClick={() => void handleSubmit()}
            disabled={isLoading}
          >
            {isLoading ? "Enviando…" : "Publicar reseña"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
