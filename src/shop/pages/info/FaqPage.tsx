import { StaticPageShell } from "@/shop/components/static/StaticPageShell";
import { Link } from "react-router";

export const FaqPage = () => {
  return (
    <StaticPageShell title="Preguntas frecuentes">
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">¿Cómo elijo la talla correcta?</h2>
        <p>
          En cada ficha de producto encontrarás medidas orientativas. Si dudas entre dos tallas, elige la
          mayor para prendas ajustadas o consulta con nuestro equipo en{" "}
          <Link to="/contacto" className="font-medium text-slate-900 underline-offset-4 hover:underline">
            contacto
          </Link>
          .
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">¿Puedo modificar o cancelar mi pedido?</h2>
        <p>
          Si el pedido aún no ha salido del almacén, contáctanos cuanto antes. Una vez enviado, podrás gestionar
          una devolución según nuestra{" "}
          <Link
            to="/envios-y-devoluciones"
            className="font-medium text-slate-900 underline-offset-4 hover:underline"
          >
            política de envíos
          </Link>
          .
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">¿Qué métodos de pago aceptáis?</h2>
        <p>
          Aceptamos las tarjetas y métodos habilitados en el checkout. El cargo se realiza de forma segura a
          través de nuestro proveedor de pagos.
        </p>
      </section>
    </StaticPageShell>
  );
};
