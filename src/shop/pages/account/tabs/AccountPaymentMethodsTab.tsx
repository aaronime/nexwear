import {
  MOCK_SAVED_PAYMENT_METHODS,
  PAYMENT_METHOD_BRAND_BADGE_CLASS,
} from "@/shop/mocks/mock-saved-payment-methods";
import { Button } from "@/components/ui/button";

export const AccountPaymentMethodsTab = () => {
  return (
    <div className="flex flex-col gap-6">
      <header className="border-b border-slate-100 pb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Tarjetas guardadas
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Misma vista previa que en el checkout (datos de demostración).
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm font-medium text-slate-700">
          {MOCK_SAVED_PAYMENT_METHODS.length} tarjetas{" "}
          <span className="font-normal text-slate-500">(demo)</span>
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          className="border-2 border-slate-200 text-slate-500"
          title="Disponible próximamente"
        >
          Añadir tarjeta
        </Button>
      </div>

      <ul className="space-y-3">
        {MOCK_SAVED_PAYMENT_METHODS.map((method) => (
          <li key={method.id}>
            <article className="rounded-xl border-2 border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${PAYMENT_METHOD_BRAND_BADGE_CLASS[method.brand]}`}
                    >
                      {method.brand}
                    </span>
                    {method.isDefault ? (
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                        Predeterminada
                      </span>
                    ) : null}
                  </div>
                  <p className="font-mono text-base font-semibold tracking-wide text-slate-900">
                    •••• •••• •••• {method.last4}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{method.holderName}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Vence {method.expiryLabel}
                  </p>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
};
