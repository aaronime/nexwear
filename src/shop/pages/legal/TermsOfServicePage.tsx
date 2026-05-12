import { StaticPageShell } from "@/shop/components/static/StaticPageShell";
import { Link } from "react-router";

export const TermsOfServicePage = () => {
  return (
    <StaticPageShell title="Términos de servicio">
      <p className="text-xs text-slate-500">Última actualización: mayo de 2026</p>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">Uso del sitio</h2>
        <p>
          Al acceder a NexWear aceptas estos términos. Debes utilizar el sitio de forma lícita, sin intentar
          vulnerar su seguridad ni interferir con el servicio de otros usuarios.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">Cuenta y pedidos</h2>
        <p>
          Eres responsable de la veracidad de los datos que nos facilitas. Los contratos de compra se perfeccionan
          cuando recibes la confirmación del pedido. Nos reservamos el derecho a cancelar pedidos en caso de
          error manifesto en el precio o indisponibilidad del producto.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">Propiedad intelectual</h2>
        <p>
          Los contenidos del sitio (textos, imágenes, marcas y diseño) están protegidos. No está permitida su
          reproducción sin autorización previa.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">Limitación de responsabilidad</h2>
        <p>
          En la medida permitida por la ley, NexWear no será responsable por daños indirectos derivados del uso
          del sitio. Las garantías legales aplicables a bienes de consumo no se ven afectadas.
        </p>
      </section>
      <p>
        Consulta también nuestra{" "}
        <Link to="/politica-de-privacidad" className="font-medium text-slate-900 underline-offset-4 hover:underline">
          política de privacidad
        </Link>
        .
      </p>
    </StaticPageShell>
  );
};
