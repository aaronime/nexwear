import {
  CreditCard,
  MapPin,
  Package,
  UserRound,
} from "lucide-react";
import { ShopBreadcrumbs } from "@/shop/components/ShopBreadcrumbs";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AccountOrdersTab } from "./tabs/AccountOrdersTab";
import { AccountPaymentMethodsTab } from "./tabs/AccountPaymentMethodsTab";
import { AccountProfileTab } from "./tabs/AccountProfileTab";
import { AccountAddressesTab } from "./tabs/AccountAddressesTab";

export const AccountPage = () => {
  return (
    <main className="min-h-[60vh] bg-linear-to-b from-slate-50/80 to-white pb-16">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <ShopBreadcrumbs
          items={[
            { label: "Inicio", to: "/" },
            { label: "Mi cuenta" },
          ]}
        />

        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Mi cuenta
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Gestiona tu perfil, métodos de pago, direcciones y pedidos desde un
              solo lugar.
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="gap-8">
          <TabsList
            variant="line"
            className="h-auto w-full min-w-0 justify-start gap-0 overflow-x-auto rounded-none border-b border-slate-200 bg-transparent p-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <TabsTrigger
              value="profile"
              className="shrink-0 rounded-none border-0 px-4 pb-3 shadow-none data-active:shadow-none"
            >
              <UserRound className="size-4" aria-hidden />
              Perfil
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="shrink-0 rounded-none border-0 px-4 pb-3 shadow-none data-active:shadow-none"
            >
              <CreditCard className="size-4" aria-hidden />
              Métodos de pago
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="shrink-0 rounded-none border-0 px-4 pb-3 shadow-none data-active:shadow-none"
            >
              <MapPin className="size-4" aria-hidden />
              Direcciones
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="shrink-0 rounded-none border-0 px-4 pb-3 shadow-none data-active:shadow-none"
            >
              <Package className="size-4" aria-hidden />
              Pedidos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-0">
            <section
              aria-labelledby="account-profile-heading"
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 id="account-profile-heading" className="sr-only">
                Información del perfil
              </h2>
              <AccountProfileTab />
            </section>
          </TabsContent>

          <TabsContent value="payments" className="mt-0">
            <section
              aria-labelledby="account-payments-heading"
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 id="account-payments-heading" className="sr-only">
                Métodos de pago
              </h2>
              <AccountPaymentMethodsTab />
            </section>
          </TabsContent>

          <TabsContent value="addresses" className="mt-0">
            <section
              aria-labelledby="account-addresses-heading"
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 id="account-addresses-heading" className="sr-only">
                Direcciones de envío
              </h2>
              <AccountAddressesTab />
            </section>
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <section
              aria-labelledby="account-orders-heading"
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 id="account-orders-heading" className="sr-only">
                Pedidos
              </h2>
              <AccountOrdersTab />
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};
