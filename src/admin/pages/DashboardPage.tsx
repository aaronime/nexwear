import { Link } from "react-router";
import {
  ArrowUpRight,
  CreditCard,
  ExternalLink,
  Layers,
  LayoutDashboard,
  Palette,
  Percent,
  Ruler,
  Shirt,
  ShoppingBag,
  Store,
  Tag,
  Tags,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { cn } from "@/lib/utils";

interface AdminTileProps {
  to: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}

const AdminTile = ({ to, title, description, icon: Icon }: AdminTileProps) => (
  <Link
    to={to}
    className={cn(
      "group relative flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-slate-900/5",
      "transition-all hover:border-slate-300 hover:shadow-md",
    )}
  >
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
      <Icon className="size-5" aria-hidden />
    </span>
    <div className="min-w-0 flex-1">
      <span className="flex items-center gap-2 font-semibold text-slate-900">
        {title}
        <ArrowUpRight
          className="size-4 shrink-0 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-700"
          aria-hidden
        />
      </span>
      <p className="mt-1 text-sm leading-snug text-slate-600">{description}</p>
    </div>
  </Link>
);

const destinations: AdminTileProps[] = [
  {
    to: "/admin/orders",
    title: "Pedidos",
    description: "Estados, detalle y seguimiento de compras.",
    icon: ShoppingBag,
  },
  {
    to: "/admin/orders/new",
    title: "Crear pedido",
    description: "Alta manual de un pedido desde el panel.",
    icon: ShoppingBag,
  },
  {
    to: "/admin/payments",
    title: "Pagos",
    description: "Movimientos y métodos de pago.",
    icon: CreditCard,
  },
  {
    to: "/admin/products",
    title: "Productos",
    description: "Catálogo, variantes e imágenes.",
    icon: Shirt,
  },
  {
    to: "/admin/users",
    title: "Usuarios",
    description: "Cuentas de cliente y administradores.",
    icon: Users,
  },
  {
    to: "/admin/brands",
    title: "Marcas",
    description: "Fabricantes vinculados al catálogo.",
    icon: Tag,
  },
  {
    to: "/admin/colors",
    title: "Colores",
    description: "Paleta para variantes de producto.",
    icon: Palette,
  },
  {
    to: "/admin/sizes",
    title: "Tallas",
    description: "Tallas disponibles en el catálogo.",
    icon: Ruler,
  },
  {
    to: "/admin/materials",
    title: "Materiales",
    description: "Composición y filtros por tejido.",
    icon: Layers,
  },
  {
    to: "/admin/tags",
    title: "Etiquetas",
    description: "Tags para filtrar en tienda.",
    icon: Tags,
  },
  {
    to: "/admin/discounts",
    title: "Descuentos",
    description: "Promociones y reglas de precio.",
    icon: Percent,
  },
];

export const DashboardPage = () => {
  const userName = useAuthStore((s) => s.user?.name);

  return (
    <div className="min-h-full bg-slate-50">
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                <LayoutDashboard className="size-3.5" aria-hidden />
                NexWear · Administración
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
                {userName ? `Hola, ${userName}` : "Panel de administración"}
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Gestiona el catálogo, pedidos y usuarios desde aquí. Usa el menú lateral o los
                accesos de abajo para ir a cada sección.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button variant="outline" size="sm" className="border-slate-200" asChild>
                <Link to="/" className="gap-2">
                  <Store className="size-4" aria-hidden />
                  Ver tienda
                  <ExternalLink className="size-3.5 opacity-70" aria-hidden />
                </Link>
              </Button>
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800" asChild>
                <Link to="/admin/orders">Ir a pedidos</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <section aria-label="Accesos al panel">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Accesos al panel</h2>
            <p className="mt-1 text-sm text-slate-600">
              Enlaces directos a las herramientas del back-office.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {destinations.map((item) => (
              <AdminTile key={item.to} {...item} />
            ))}
          </div>
        </section>

        <section
          aria-label="Guía rápida"
          className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8"
        >
          <h2 className="text-lg font-semibold text-slate-900">Guía rápida</h2>
          <p className="mt-1 text-sm text-slate-600">
            Recomendaciones operativas para el día a día (sin analítica ni cuadros de mando).
          </p>
          <ul className="mt-6 space-y-4 text-sm text-slate-700">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
              <span>
                <strong className="font-medium text-slate-900">Pedidos:</strong> revisa pendientes y
                actualiza el estado cuando el envío salga al cliente.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
              <span>
                <strong className="font-medium text-slate-900">Catálogo:</strong> mantén variantes
                (talla, color) con stock coherente para evitar ventas sin existencias.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
              <span>
                <strong className="font-medium text-slate-900">Descuentos:</strong> comprueba
                fechas de inicio y fin antes de campañas para que los precios en tienda cuadren.
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};
