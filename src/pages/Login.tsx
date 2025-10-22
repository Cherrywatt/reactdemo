import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDot, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí puedes agregar la lógica de autenticación con tu base de datos
    // Por ahora, solo mostramos un mensaje
    if (email && password) {
      toast({
        title: "Inicio de sesión",
        description: "Funcionalidad de base de datos pendiente de implementar",
      });
      
      // Puedes navegar de vuelta a la página principal después del login
      // navigate("/");
    } else {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
    }
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

        {/* Card de Login */}
        <Card className="border-2 border-primary/20 shadow-glow">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <CircleDot className="w-16 h-16 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-center">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center text-base">
              Ingresa a tu cuenta de La China Sports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-primary/30 focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-primary/30 focus:border-primary"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-sm text-primary hover:text-primary-glow transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary-glow shadow-glow"
              >
                Iniciar Sesión
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-primary hover:text-primary-glow font-medium transition-colors"
                >
                  Regístrate aquí
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Nota para desarrollo */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-primary/10">
          <p className="text-xs text-center text-muted-foreground">
            Este formulario está listo para conectarse a tu base de datos.
            <br />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

