# NexWear — Descripción del proyecto

**NexWear** es una aplicación web de **comercio electrónico orientado a moda** (ropa y accesorios). Incluye **tienda pública** (catálogo, producto, carrito, checkout, cuenta), **panel de administración** para gestionar catálogo y operaciones, y **autenticación** de usuarios. El frontend consume una **API REST** backend (axios) para productos, carrito, pedidos, reseñas, direcciones, etc.

---

## Stack principal

| Área | Tecnología |
|------|------------|
| Runtime / bundler | **Vite 8** |
| UI | **React 19** |
| Lenguaje | **TypeScript** (~6.x) |
| Enrutamiento | **React Router 7** (`createBrowserRouter`) |
| Estilos | **Tailwind CSS 4** (plugin `@tailwindcss/vite`) |
| Componentes UI | **shadcn** + **Radix UI** |
| Datos remotos | **TanStack Query (React Query) 5** |
| HTTP | **Axios** |
| Formularios | **React Hook Form** |
| Estado cliente global | **Zustand** (p. ej. checkout, auth) |
| Iconos | **Lucide React** |
| Carruseles | **Swiper 12** |
| Notificaciones | **Sonner** |
| Temas (claro/oscuro) | **next-themes** |
| Fuentes | **Geist Variable** (`@fontsource-variable/geist`) |

### Herramientas de desarrollo

- **ESLint 9** + **typescript-eslint**, reglas de **React Hooks** y **TanStack Query**
- **React Compiler** (preset Babel en Vite, vía `@rolldown/plugin-babel`)
- **TanStack Query Devtools**
- Alias de imports: `@/` → `src/`

---

## Estructura del código (`src/`)

- **`shop/`** — Tienda: layouts, páginas (inicio, catálogo, producto, carrito, checkout, cuenta, legales/info), hooks y acciones de catálogo/carrito
- **`admin/`** — Panel admin: productos, pedidos, pagos, usuarios, marcas, tallas, colores, materiales, etiquetas, descuentos
- **`auth/`** — Login, registro, store de sesión, rutas protegidas, acciones de carrito usuario
- **`api/`** — Clientes Axios (p. ej. API principal `nexwearApi`)
- **`components/ui/`** — Componentes reutilizables (shadcn, botones, sonner, etc.)
- **`app.router.tsx`** — Definición central de rutas
- **`Nexwear.tsx`** — `QueryClientProvider`, auth bootstrap, `RouterProvider`, toasts

---

## Funcionalidades destacadas (tienda)

- Catálogo con **filtros** (desktop + panel móvil), variantes (talla/color), grid y ordenación
- **Ficha de producto**: galería con swiper, selección de variante, reseñas, sugerencias (“también te puede gustar”)
- **Carrito** y **checkout** (dirección, método de pago demo, revisión)
- **Cuenta**: pedidos, direcciones, perfil (según rutas implementadas)
- **Envío** calculado en cliente en `useCart` (p. ej. envío gratis por encima de un umbral de subtotal)

---

## Scripts npm

```bash
npm run dev      # Servidor de desarrollo (Vite)
npm run build    # tsc -b && vite build
npm run lint     # eslint .
npm run preview  # Vista previa del build
```

---

## Requisitos

- **Node.js** compatible con las versiones actuales de Vite/React (consultar documentación de Vite 8)
- Variables de entorno / URL base de API según configuración del proyecto (`nexwearApi` u otros clientes)

---
