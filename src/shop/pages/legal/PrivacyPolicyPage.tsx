import { StaticPageShell } from "@/shop/components/static/StaticPageShell";

export const PrivacyPolicyPage = () => {
  return (
    <StaticPageShell title="Política de privacidad">
      <p className="text-xs text-slate-500">Última actualización: mayo de 2026</p>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">Responsable del tratamiento</h2>
        <p>
          NexWear (en adelante, «nosotros») trata tus datos personales conforme al Reglamento (UE) 2016/679
          (RGPD) y la normativa aplicable en materia de protección de datos.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">Datos que recogemos</h2>
        <p>
          Podemos tratar identificativos de contacto, dirección de envío, historial de pedidos, datos de pago
          (gestionados por el proveedor de pagos) y, si nos escribes, el contenido de tu mensaje.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">Finalidades y base legal</h2>
        <p>
          Gestionamos tu cuenta y pedidos (ejecución contractual), atendemos consultas (interés legítimo o
          consentimiento), y te enviamos comunicaciones comerciales solo si nos has dado tu consentimiento o
          cuando la ley lo permita.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">Tus derechos</h2>
        <p>
          Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento
          y portabilidad contactando con nosotros. También puedes reclamar ante la autoridad de control en tu
          país.
        </p>
      </section>
    </StaticPageShell>
  );
};
