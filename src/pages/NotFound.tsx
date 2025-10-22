import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center p-8 bg-card rounded-lg shadow-lg max-w-md">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <p className="mb-4 text-xl text-foreground">¡Página no encontrada!</p>
        <p className="mb-6 text-sm text-muted-foreground">
          Intentaste acceder a: <code className="bg-secondary px-2 py-1 rounded">{location.pathname}</code>
        </p>
        <a 
          href="/" 
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
        >
          Volver al Inicio
        </a>
        <div className="mt-6 text-xs text-muted-foreground">
          <p>Rutas disponibles:</p>
          <ul className="mt-2">
            <li>/ (Página principal)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
