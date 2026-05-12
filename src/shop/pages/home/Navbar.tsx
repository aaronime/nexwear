import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { SearchBar } from "./SearchBar";
import { Link, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useCart } from "@/shop/hooks/useCart";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { UserRole } from "@/shop/interfaces/authResponse";

export const Navbar = () => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const authStatus = useAuthStore((state) => state.authStatus);
  const logout = useAuthStore((state) => state.logout);
  const isAdminUser =
    useAuthStore((state) => state.user?.role) === UserRole.ADMIN;
  const accountOrLoginHref =
    authStatus === "authenticated" ? "/account" : "/login";

  useEffect(() => {
    const id = window.setTimeout(() => {
      setIsMobileSearchOpen(false);
      setIsMobileNavOpen(false);
    }, 0);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const categories = [
    { label: "Novedades", href: "/new-arrivals?sortBy=newest" },
    { label: "Hombres", href: "/gender/men" },
    { label: "Mujeres", href: "/gender/women" },
    { label: "Unisex", href: "/gender/unisex" },
    { label: "Niños", href: "/gender/kids" },
  ];

  const iconBtn =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-slate-100 sm:h-10 sm:w-10";
  const iconSvg = "size-[1.125rem] text-slate-700 sm:h-5 sm:w-5";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-2 sm:h-16">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3 lg:gap-8">
            <button
              type="button"
              className={`${iconBtn} lg:hidden`}
              aria-label={
                isMobileNavOpen ? "Cerrar menú" : "Abrir menú de navegación"
              }
              aria-expanded={isMobileNavOpen}
              onClick={() => setIsMobileNavOpen((open) => !open)}
            >
              {isMobileNavOpen ? (
                <X className="size-5 text-slate-700" aria-hidden />
              ) : (
                <Menu className="size-5 text-slate-700" aria-hidden />
              )}
            </button>

            <Link
              to="/"
              className="flex min-w-0 items-center gap-1.5 sm:gap-2"
              onClick={() => setIsMobileNavOpen(false)}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-slate-900 to-slate-700 sm:h-10 sm:w-10">
                <span className="text-base font-bold text-white sm:text-lg">
                  N
                </span>
              </div>
              <span className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-2xl">
                NexWear
              </span>
            </Link>

            <div className="hidden items-center gap-6 lg:flex">
              {categories.map((category) => (
                <Link
                  key={category.label}
                  to={category.href}
                  className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5 md:gap-3">
            <div className="hidden sm:block">
              <SearchBar />
            </div>

            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(true)}
              className={`${iconBtn} sm:hidden`}
              aria-label="Buscar productos"
            >
              <svg
                className={iconSvg}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {authStatus === "authenticated" && isAdminUser ? (
              <Link
                to="/admin"
                aria-label="Ir al panel de administración"
                title="Administración"
                className={`${iconBtn} hidden hover:bg-violet-50 min-[360px]:flex`}
              >
                <LayoutDashboard
                  className={`${iconSvg} hover:text-violet-800`}
                  aria-hidden
                />
              </Link>
            ) : null}

            <Link
              to={accountOrLoginHref}
              aria-label={
                authStatus === "authenticated"
                  ? "Ir a mi cuenta"
                  : "Iniciar sesión"
              }
              className={iconBtn}
            >
              <svg
                className={iconSvg}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>

            {authStatus === "authenticated" ? (
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
                className={`${iconBtn} group hidden hover:bg-red-50 min-[420px]:flex`}
              >
                <LogOut
                  className={`${iconSvg} group-hover:text-red-800`}
                  aria-hidden
                />
              </button>
            ) : null}

            <Link
              to="/cart"
              className={`${iconBtn} relative`}
              aria-label={`Carrito${
                cart && cart.items.length > 0
                  ? `, ${cart.items.length} artículos`
                  : ""
              }`}
            >
              <svg
                className={iconSvg}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cart && cart.items.length > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-[0.65rem] font-bold leading-none text-white sm:-right-1 sm:-top-1 sm:text-xs">
                  {cart.items.length > 9 ? "9+" : cart.items.length}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </div>

      {isMobileNavOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-100 flex flex-col bg-black/40 lg:hidden"
              role="presentation"
            >
              <div
                className="max-h-[min(85vh,100dvh)] shrink-0 overflow-y-auto border-b border-slate-200 bg-white shadow-lg"
                role="dialog"
                aria-label="Navegación"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">
                      Categorías
                    </p>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
                      aria-label="Cerrar menú"
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      <X className="size-5 text-slate-700" />
                    </button>
                  </div>
                  <ul className="grid gap-0.5 pb-3">
                    {categories.map((category) => (
                      <li key={category.href}>
                        <Link
                          to={category.href}
                          className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-800 hover:bg-slate-100 active:bg-slate-100"
                          onClick={() => setIsMobileNavOpen(false)}
                        >
                          {category.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                type="button"
                className="min-h-0 min-w-0 flex-1 cursor-default bg-transparent"
                aria-label="Cerrar menú"
                onClick={() => setIsMobileNavOpen(false)}
              />
            </div>,
            document.body
          )
        : null}

      {isMobileSearchOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-100 bg-black/50 sm:hidden"
              onClick={() => setIsMobileSearchOpen(false)}
            >
              <div
                className="absolute inset-x-0 top-0 max-h-[min(90vh,100dvh)] overflow-y-auto bg-white p-4 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Buscar productos
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsMobileSearchOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-slate-100"
                    aria-label="Cerrar búsqueda"
                  >
                    <X className="size-5 text-slate-700" />
                  </button>
                </div>
                <SearchBar onNavigate={() => setIsMobileSearchOpen(false)} />
              </div>
            </div>,
            document.body
          )
        : null}
    </nav>
  );
};
