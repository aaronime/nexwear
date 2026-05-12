import { StaticPageShell } from "@/shop/components/static/StaticPageShell";
import { Link } from "react-router";

export const CareersPage = () => {
  return (
    <StaticPageShell title="Carreras">
      <p>
        En NexWear buscamos personas apasionadas por la moda, la tecnología y la experiencia del cliente.
        Publicamos ofertas en esta página cuando tenemos procesos abiertos; también puedes enviarnos tu
        currículum de forma espontánea.
      </p>
      <p>
        Áreas habituales: diseño de producto, operaciones logísticas, atención al cliente, marketing digital y
        desarrollo de software.
      </p>
      <p>
        Para candidaturas o consultas, utiliza nuestro{" "}
        <Link to="/contacto" className="font-medium text-slate-900 underline-offset-4 hover:underline">
          formulario de contacto
        </Link>
        .
      </p>
    </StaticPageShell>
  );
};
