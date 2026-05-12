import { Button } from "@/components/ui/button";

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-2xl" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-700 ring-4 ring-slate-700/50">
              <span className="text-6xl font-bold text-white">404</span>
            </div>
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
          Página No Encontrada
        </h1>
        
        <p className="mb-8 text-lg text-slate-300">
          Lo sentimos, la página que estás buscando no existe o ha sido movida. 
          Verifica la URL o regresa al inicio.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="bg-white text-slate-900 transition-all hover:scale-105 hover:bg-slate-100"
            onClick={() => window.location.href = "/"}
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Volver al Inicio
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white transition-all hover:scale-105 hover:bg-white/10"
            onClick={() => window.history.back()}
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Regresar
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
          <a
            href="/gender/men"
            className="group rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-slate-800"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-white">Hombres</h3>
            <p className="text-sm text-slate-400 group-hover:text-slate-300">
              Explora la colección masculina
            </p>
          </a>

          <a
            href="/gender/women"
            className="group rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-slate-800"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-600">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-white">Mujeres</h3>
            <p className="text-sm text-slate-400 group-hover:text-slate-300">
              Descubre la colección femenina
            </p>
          </a>

          <a
            href="/gender/kids"
            className="group rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-slate-800"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-600">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-white">Niños</h3>
            <p className="text-sm text-slate-400 group-hover:text-slate-300">
              Ropa para los más pequeños
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};
