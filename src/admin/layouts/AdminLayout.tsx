import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  LayoutDashboard,
  Layers,
  LogOut,
  Palette,
  Percent,
  Ruler,
  ShoppingBag,
  Shirt,
  Tag,
  Tags,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SIDEBAR_STORAGE_KEY = "nexwear-admin-sidebar-collapsed";

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  });

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const navItems = [
    {
      label: "Resumen",
      href: "/admin",
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "Pedidos",
      href: "/admin/orders",
      icon: ShoppingBag,
      end: false,
    },
    {
      label: "Pagos",
      href: "/admin/payments",
      icon: CreditCard,
      end: false,
    },
    {
      label: "Usuarios",
      href: "/admin/users",
      icon: Users,
      end: false,
    },
    {
      label: "Productos",
      href: "/admin/products",
      icon: Shirt,
      end: false,
    },
    {
      label: "Marcas",
      href: "/admin/brands",
      icon: Tag,
      end: false,
    },
    {
      label: "Colores",
      href: "/admin/colors",
      icon: Palette,
      end: false,
    },
    {
      label: "Tallas",
      href: "/admin/sizes",
      icon: Ruler,
      end: false,
    },
    {
      label: "Materiales",
      href: "/admin/materials",
      icon: Layers,
      end: false,
    },
    {
      label: "Tags",
      href: "/admin/tags",
      icon: Tags,
      end: false,
    },
    {
      label: "Descuentos",
      href: "/admin/discounts",
      icon: Percent,
      end: false,
    },
  ] as const;

  const isActivePath = (href: string, end?: boolean) => {
    if (end) {
      return location.pathname === href || location.pathname === `${href}/`;
    }
    return (
      location.pathname === href ||
      location.pathname.startsWith(`${href}/`)
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside
        className={cn(
          "sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white shadow-sm transition-[width] duration-200 ease-out",
          collapsed ? "w-17" : "w-60",
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center border-b border-slate-100 px-3",
            collapsed ? "justify-center" : "justify-between gap-2",
          )}
        >
          {!collapsed ? (
            <Link
              to="/admin"
              className="flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-slate-900 to-slate-700">
                <span className="text-sm font-bold text-white">N</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-tight">
                  NexWear
                </p>
                <p className="truncate text-xs font-medium text-slate-500">
                  Admin
                </p>
              </div>
            </Link>
          ) : (
            <Link
              to="/admin"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-slate-900 to-slate-700"
              title="Panel"
            >
              <span className="text-sm font-bold text-white">N</span>
            </Link>
          )}
          {!collapsed ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-slate-600"
              onClick={toggleSidebar}
              aria-label="Contraer barra lateral"
            >
              <ChevronLeft className="size-4" />
            </Button>
          ) : null}
        </div>

        {collapsed ? (
          <div className="flex justify-center border-b border-slate-100 py-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-slate-600"
              onClick={toggleSidebar}
              aria-label="Expandir barra lateral"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        ) : null}

        <nav className="flex flex-1 flex-col gap-1 p-2" aria-label="Admin">
          {navItems.map(({ label, href, icon: Icon, end }) => {
            const active = isActivePath(href, end);
            return (
              <Link
                key={href}
                to={href}
                title={collapsed ? label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  collapsed && "justify-center px-2",
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100",
                )}
              >
                <Icon className="size-4.5 shrink-0" aria-hidden />
                {!collapsed ? <span>{label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-100 p-2">
          {!collapsed && user ? (
            <p className="mb-2 truncate px-2 text-xs text-slate-500">
              {user.name}
            </p>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "mb-1 w-full justify-start gap-2 text-slate-700 hover:bg-slate-100",
              collapsed && "justify-center px-0",
            )}
            asChild
          >
            <Link to="/" title={collapsed ? "Volver a la tienda" : undefined}>
              <Home className="size-4 shrink-0" aria-hidden />
              {!collapsed ? <span>Volver a la tienda</span> : null}
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start gap-2 text-slate-700 hover:bg-red-50 hover:text-red-800",
              collapsed && "justify-center px-0",
            )}
            onClick={handleLogout}
            title={collapsed ? "Cerrar sesión" : undefined}
          >
            <LogOut className="size-4 shrink-0" aria-hidden />
            {!collapsed ? <span>Cerrar sesión</span> : null}
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
};
