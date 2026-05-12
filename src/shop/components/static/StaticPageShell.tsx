import type { ReactNode } from "react";
import { Link } from "react-router";

type StaticPageShellProps = {
  title: string;
  children: ReactNode;
};

export const StaticPageShell = ({ title, children }: StaticPageShellProps) => {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link to="/" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
        ← Inicio
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600">{children}</div>
    </main>
  );
};
