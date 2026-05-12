import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TablePaginationProps {
  page: number;
  pages: number;
  total: number;
  limit: number;
  countOnPage: number;
  onPageChange: (nextPage: number) => void;
  isBusy?: boolean;
  /** Etiqueta accesible del bloque de paginación */
  ariaLabel?: string;
  /**
   * Texto tras el total cuando hay registros, p. ej. "pedidos" →
   * "Mostrando 1–10 de 25 pedidos"
   */
  totalItemLabel?: string;
  /** Texto cuando total === 0 (solo si se muestra la paginación) */
  emptySummaryText?: string;
  className?: string;
}

export const TablePagination = ({
  page,
  pages,
  total,
  limit,
  countOnPage,
  onPageChange,
  isBusy = false,
  ariaLabel = "Paginación",
  totalItemLabel,
  emptySummaryText = "Sin resultados",
  className,
}: TablePaginationProps) => {
  if (pages <= 1 && total <= limit) {
    return null;
  }

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to =
    total === 0 ? 0 : Math.min((page - 1) * limit + countOnPage, total);

  return (
    <nav
      className={cn(
        "flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      aria-label={ariaLabel}
    >
      <p className="text-sm text-slate-600">
        {total === 0 ? (
          emptySummaryText
        ) : (
          <>
            Mostrando{" "}
            <span className="font-medium text-slate-900">
              {from}–{to}
            </span>{" "}
            de <span className="font-medium text-slate-900">{total}</span>
            {totalItemLabel ? (
              <>
                {" "}
                {totalItemLabel}
              </>
            ) : null}
          </>
        )}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={page <= 1 || isBusy}
          onClick={() => onPageChange(page - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Anterior
        </Button>
        <span className="min-w-28 text-center text-sm tabular-nums text-slate-700">
          Página {page} de {pages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={page >= pages || isBusy}
          onClick={() => onPageChange(page + 1)}
          aria-label="Página siguiente"
        >
          Siguiente
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>
    </nav>
  );
};
