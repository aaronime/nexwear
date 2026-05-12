import { StaticPageShell } from "@/shop/components/static/StaticPageShell";
import { Link } from "react-router";

export const PressPage = () => {
  return (
    <StaticPageShell title="Prensa">
      <p>
        Los medios pueden solicitar dossier de marca, imágenes de alta resolución y notas sobre colecciones a
        través del canal oficial de comunicación.
      </p>
      <p>
        Indica en tu mensaje el medio, el tema de la pieza y el plazo de publicación para poder atenderte con
        prioridad.
      </p>
      <p>
        Contacto para prensa: utiliza la sección{" "}
        <Link to="/contacto" className="font-medium text-slate-900 underline-offset-4 hover:underline">
          Contáctanos
        </Link>{" "}
        y selecciona el asunto «Prensa» si está disponible, o menciónalo en el cuerpo del mensaje.
      </p>
    </StaticPageShell>
  );
};
