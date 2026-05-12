import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormInputs = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    setIsLoading(true);

    try {
      const success = await login(data.email, data.password);

      if (success) {
        toast.success("¡Bienvenido!", {
          description: "Has iniciado sesión correctamente.",
        });
        navigate("/");
      } else {
        toast.error("Error al iniciar sesión", {
          description:
            "Credenciales incorrectas. Por favor, verifica tu correo y contraseña.",
        });
      }
    } catch {
      toast.error("Error inesperado", {
        description:
          "Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 lg:block">
        <div className="flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
              <span className="text-2xl font-bold text-slate-900">N</span>
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">
              NexWear
            </span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight text-white">
              Bienvenido de vuelta
            </h1>
            <p className="text-xl text-slate-300">
              Inicia sesión para acceder a tu cuenta y disfrutar de todas las
              funciones exclusivas de NexWear.
            </p>
          </div>

          <div className="space-y-4 text-sm text-slate-400">
            <p>© 2026 NexWear. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center bg-white px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-slate-900 to-slate-700">
                <span className="text-lg font-bold text-white">N</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                NexWear
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="font-semibold text-slate-900 transition-colors hover:text-slate-700"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register("email", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo electrónico inválido",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </Button>
            <Link to="/">
              <Button
                type="button"
                className="w-full bg-white border-gray-400 text-black hover:bg-gray-100"
                size="lg"
              >
                Continuar como invitado
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};
