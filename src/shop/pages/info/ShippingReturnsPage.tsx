import { StaticPageShell } from "@/shop/components/static/StaticPageShell";
import { Link } from "react-router";

export const ShippingReturnsPage = () => {
  return (
    <StaticPageShell title="Envíos y devoluciones">
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">Envíos</h2>
        <p>
          Procesamos los pedidos en 1–3 días hábiles. Los plazos de entrega dependen del destino y del servicio
          de paquetería seleccionado; recibirás un correo con el seguimiento en cuanto tu pedido salga de
          almacén.
        </p>
        <p>
          Los gastos de envío se muestran antes de finalizar la compra. En campañas puntuales puede haber envío
          gratuito a partir de un importe mínimo.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">Devoluciones</h2>
        <p>
          Dispones de un plazo para solicitar la devolución de artículos en condiciones de reventa, con
          etiquetas originales y sin uso, salvo indicación contraria para productos de higiene o personalización.
        </p>
        <p>
          Inicia la devolución desde tu cuenta o escribiendo a{" "}
          <a href="mailto:hola@nexwear.example" className="font-medium text-slate-900 underline-offset-4 hover:underline">
            hola@nexwear.example
          </a>
          . Los reembolsos se procesan por el mismo medio de pago utilizado en la compra, una vez recibido y
          revisado el artículo.
        </p>
      </section>
      <p>
        ¿Necesitas más detalle?{" "}
        <Link to="/contacto" className="font-medium text-slate-900 underline-offset-4 hover:underline">
          Contáctanos
        </Link>
        .
      </p>
    </StaticPageShell>
  );
};
