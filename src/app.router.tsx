import { createBrowserRouter } from "react-router";
import { AdminLayout } from "./admin/layouts/AdminLayout";

import { AdminOrdersPage } from "./admin/pages/AdminOrdersPage";
import { AdminOrderDetailPage } from "./admin/pages/AdminOrderDetailPage";
import { AdminPaymentsPage } from "./admin/pages/AdminPaymentsPage";
import { AdminProductsPage } from "./admin/pages/AdminProductsPage";
import { AdminProductManagePage } from "./admin/pages/AdminProductManagePage";
import { AdminColorsPage } from "./admin/pages/AdminColorsPage";
import { AdminBrandsPage } from "./admin/pages/AdminBrandsPage";
import { AdminSizesPage } from "./admin/pages/AdminSizesPage";
import { AdminMaterialsPage } from "./admin/pages/AdminMaterialsPage";
import { AdminTagsPage } from "./admin/pages/AdminTagsPage";
import { AdminDiscountsPage } from "./admin/pages/AdminDiscountsPage";
import { AdminUsersPage } from "./admin/pages/AdminUsersPage";
import { AdminCreateOrderPage } from "./admin/pages/AdminCreateOrderPage";
import { AdminRoute } from "./auth/routes/ProtectedRoutes";
import { MainLayout } from "./shop/layouts/MainLayout";
import { HomePage } from "./shop/pages/home/HomePage";
import { ProductPage } from "./shop/pages/product/ProductPage";
import { CatalogPage } from "./shop/pages/catalog/CatalogPage";
import { NotFoundPage } from "./shop/pages/error/NotFoundPage";
import { LoginPage } from "./auth/pages/LoginPage";
import { RegisterPage } from "./auth/pages/RegisterPage";
import { CartPage } from "./shop/pages/cart/CartPage";
import { ShippingAddressPage } from "./shop/pages/checkout/ShippingAddressPage";
import { PaymentMethodPage } from "./shop/pages/checkout/PaymentMethodPage";
import { CheckoutReviewPage } from "./shop/pages/checkout/CheckoutReviewPage";
import { CheckoutSuccessPage } from "./shop/pages/checkout/CheckoutSuccessPage";
import { AccountPage } from "./shop/pages/account/AccountPage";
import { OrderDetailPage } from "./shop/pages/account/OrderDetailPage";
import { DashboardPage } from "./admin/pages/DashboardPage";
import { AboutPage } from "./shop/pages/info/AboutPage";
import { CareersPage } from "./shop/pages/info/CareersPage";
import { SustainabilityPage } from "./shop/pages/info/SustainabilityPage";
import { PressPage } from "./shop/pages/info/PressPage";
import { ContactPage } from "./shop/pages/info/ContactPage";
import { FaqPage } from "./shop/pages/info/FaqPage";
import { ShippingReturnsPage } from "./shop/pages/info/ShippingReturnsPage";
import { PrivacyPolicyPage } from "./shop/pages/legal/PrivacyPolicyPage";
import { TermsOfServicePage } from "./shop/pages/legal/TermsOfServicePage";

export const AppRouter = createBrowserRouter([
    {
        path: "/admin",
        element: (
            <AdminRoute>
                <AdminLayout />
            </AdminRoute>
        ),
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "orders",
                element: <AdminOrdersPage />,
            },
            {
                path: "orders/new",
                element: <AdminCreateOrderPage />,
            },
            {
                path: "orders/:orderId",
                element: <AdminOrderDetailPage />,
            },
            {
                path: "payments",
                element: <AdminPaymentsPage />,
            },
            {
                path: "users",
                element: <AdminUsersPage />,
            },
            {
                path: "products",
                element: <AdminProductsPage />,
            },
            {
                path: "products/:productId",
                element: <AdminProductManagePage />,
            },
            {
                path: "colors",
                element: <AdminColorsPage />,
            },
            {
                path: "brands",
                element: <AdminBrandsPage />,
            },
            {
                path: "sizes",
                element: <AdminSizesPage />,
            },
            {
                path: "materials",
                element: <AdminMaterialsPage />,
            },
            {
                path: "tags",
                element: <AdminTagsPage />,
            },
            {
                path: "discounts",
                element: <AdminDiscountsPage />,
            },
        ],
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "gender/:genderId",
                element: <CatalogPage />,
            },
            {
                path: "new-arrivals",
                element: <CatalogPage />,
            },
            {
                path: "search",
                element: <CatalogPage />,
            },
            {
                path: "product/:id",
                element: <ProductPage />,
            },
            {
                path: "cart",
                element: <CartPage />,
            },
            {
                path: "account/orders/:orderId",
                element: <OrderDetailPage />,
            },
            {
                path: "account",
                element: <AccountPage />,
            },
            {
                path: "checkout/shipping",
                element: <ShippingAddressPage />,
            },
            {
                path: "checkout/payment",
                element: <PaymentMethodPage />,
            },
            {
                path: "checkout/review",
                element: <CheckoutReviewPage />,
            },
            {
                path: "checkout/complete",
                element: <CheckoutSuccessPage />,
            },
            {
                path: "sobre-nosotros",
                element: <AboutPage />,
            },
            {
                path: "carreras",
                element: <CareersPage />,
            },
            {
                path: "sostenibilidad",
                element: <SustainabilityPage />,
            },
            {
                path: "prensa",
                element: <PressPage />,
            },
            {
                path: "contacto",
                element: <ContactPage />,
            },
            {
                path: "preguntas-frecuentes",
                element: <FaqPage />,
            },
            {
                path: "envios-y-devoluciones",
                element: <ShippingReturnsPage />,
            },
            {
                path: "politica-de-privacidad",
                element: <PrivacyPolicyPage />,
            },
            {
                path: "terminos-de-servicio",
                element: <TermsOfServicePage />,
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
])