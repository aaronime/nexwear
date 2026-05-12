import { Link } from "react-router";

import { StaticPageShell } from "@/shop/components/static/StaticPageShell";

export const ContactPage = () => {
  return (
    <StaticPageShell title="Contáctanos">
      <p>
        Estamos para ayudarte con pedidos, tallas, devoluciones o cualquier otra duda sobre NexWear. Nuestro
        equipo suele responder en un plazo de 24–48 horas hábiles.
      </p>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
        <p className="font-semibold text-slate-900">Correo</p>
        <p className="mt-1">
          <a href="mailto:hola@nexwear.example" className="text-slate-900 underline-offset-4 hover:underline">
            hola@nexwear.example
          </a>
        </p>
        <p className="mt-4 font-semibold text-slate-900">Horario de atención</p>
        <p className="mt-1">Lunes a viernes, 9:00 – 18:00 (hora local).</p>
      </div>
      <p>
        Antes de escribir, puedes revisar{" "}
        <Link
          to="/preguntas-frecuentes"
          className="font-medium text-slate-900 underline-offset-4 hover:underline"
        >
          Preguntas frecuentes
        </Link>{" "}
        y{" "}
        <Link
          to="/envios-y-devoluciones"
          className="font-medium text-slate-900 underline-offset-4 hover:underline"
        >
          Envíos y devoluciones
        </Link>
        .
      </p>
    </StaticPageShell>
  );
};
