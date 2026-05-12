import { Link } from "react-router";

export interface ShopBreadcrumbItem {
  label: string;
  to?: string;
}

interface Props {
  items: ShopBreadcrumbItem[];
  className?: string;
}

const Chevron = () => (
  <svg
    className="h-4 w-4 shrink-0 text-slate-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export const ShopBreadcrumbs = ({
  items,
  className = "",
}: Props) => (
  <nav
    aria-label="Ruta de navegación"
    className={`mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600 ${className}`}
  >
    {items.map((item, index) => {
      return (
        <span key={`${item.label}-${index}`} className="contents">
          {index > 0 ? <Chevron /> : null}
          {item.to != null ? (
            <Link
              to={item.to}
              className="transition-colors hover:text-slate-900"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-slate-900">{item.label}</span>
          )}
        </span>
      );
    })}
  </nav>
);
