import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { toast } from "sonner";
import { register } from "../actions/register.action";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInputs>();

  const password = watch("password");

  const onSubmit = async (data: FormInputs) => {
    setIsLoading(true);

    try {
      const response = await register(data.email, data.password, data.name);

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        const success = await login(data.email, data.password);

        if (success) {
          toast.success("¡Cuenta creada exitosamente!", {
            description: "Tu cuenta ha sido creada. Bienvenido a NexWear.",
          });
          navigate("/");
        }
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? ((error.response?.data as { message?: string } | undefined)?.message ??
          "No se pudo crear la cuenta. Por favor, intenta de nuevo.")
        : "No se pudo crear la cuenta. Por favor, intenta de nuevo.";

      toast.error("Error al crear cuenta", {
        description: errorMessage,
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
              Únete a NexWear
            </h1>
            <p className="text-xl text-slate-300">
              Crea tu cuenta y descubre una nueva forma de comprar ropa. Accede a ofertas exclusivas y mucho más.
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
            <h2 className="text-3xl font-bold text-slate-900">Crear Cuenta</h2>
            <p className="mt-2 text-sm text-slate-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="font-semibold text-slate-900 transition-colors hover:text-slate-700"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                {...registerField("name", {
                  required: "El nombre es obligatorio",
                  minLength: {
                    value: 2,
                    message: "El nombre debe tener al menos 2 caracteres",
                  },
                })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...registerField("email", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo electrónico inválido",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...registerField("password", {
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...registerField("confirmPassword", {
                  required: "Debes confirmar tu contraseña",
                  validate: (value) =>
                    value === password || "Las contraseñas no coinciden",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                {...registerField("terms", {
                  required: "Debes aceptar los términos y condiciones",
                })}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900"
              />
              <Label htmlFor="terms" className="font-normal leading-tight">
                Acepto los{" "}
                <Link
                  to="/terms"
                  className="font-semibold text-slate-900 hover:text-slate-700"
                >
                  términos y condiciones
                </Link>{" "}
                y la{" "}
                <Link
                  to="/privacy"
                  className="font-semibold text-slate-900 hover:text-slate-700"
                >
                  política de privacidad
                </Link>
              </Label>
            </div>
            {errors.terms && (
              <p className="text-sm text-destructive">{errors.terms.message}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear Cuenta
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
          </form>

        </div>
      </div>
    </div>
  );
};
