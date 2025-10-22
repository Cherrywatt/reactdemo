import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CircleDot, ArrowLeft, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Error",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive",
      });
      return;
    }

    // Aquí puedes agregar la lógica para guardar en la base de datos
    toast({
      title: "¡Registro exitoso!",
      description: "Tu cuenta ha sido creada. Funcionalidad de BD pendiente.",
    });

    // Opcional: Redirigir al login después del registro
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Botón para volver */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4 text-primary hover:text-primary-glow"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>

        {/* Card de Registro */}
        <Card className="border-2 border-primary/20 shadow-glow">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <UserPlus className="w-12 h-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center">
              Crear Cuenta
            </CardTitle>
            <CardDescription className="text-center text-base">
              Únete a La China Sports y disfruta de contenido exclusivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nombre completo */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">
                  Nombre Completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-11 border-primary/30 focus:border-primary"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-11 border-primary/30 focus:border-primary"
                  required
                />
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-11 border-primary/30 focus:border-primary"
                  required
                />
              </div>

              {/* Confirmar Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-11 border-primary/30 focus:border-primary"
                  required
                />
              </div>

              {/* Términos y condiciones */}
              <div className="flex items-start space-x-3 pt-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, acceptTerms: checked as boolean }))
                  }
                  className="mt-1"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  Acepto los{" "}
                  <a href="#" className="text-primary hover:text-primary-glow underline">
                    términos y condiciones
                  </a>{" "}
                  y la{" "}
                  <a href="#" className="text-primary hover:text-primary-glow underline">
                    política de privacidad
                  </a>
                </Label>
              </div>

              {/* Botón de registro */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary-glow shadow-glow"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Crear Cuenta
              </Button>

              {/* Link a login */}
              <div className="text-center text-sm text-muted-foreground pt-2">
                ¿Ya tienes una cuenta?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-primary hover:text-primary-glow font-medium transition-colors"
                >
                  Inicia sesión aquí
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Nota para desarrollo */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-primary/10">
          <p className="text-xs text-center text-muted-foreground">
            Este formulario incluye validaciones básicas y está listo para conectarse a tu base de datos.
            <br />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

