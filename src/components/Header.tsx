import { CircleDot, LogIn, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  return (
    <header className="bg-primary shadow-glow sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CircleDot className="w-10 h-10 text-primary-foreground" />
            <h1 className="text-2xl font-bold text-primary-foreground">
              La China Sports{user && (user.role === 'ADMIN_OWNER' || user.role === 'ADMIN_DEVELOPER') ? ' - modo administrador' : ''}
            </h1>
          </div>
          <div className="flex items-center gap-8">
            <nav className="flex items-center gap-8">
              <a href="#inicio" className="text-primary-foreground hover:text-primary-glow transition-colors font-medium">Inicio</a>
              <a href="#en-vivo" className="text-primary-foreground hover:text-primary-glow transition-colors font-medium">En Vivo</a>
              <a href="#resultados" className="text-primary-foreground hover:text-primary-glow transition-colors font-medium">Resultados</a>
              <a href="#noticias" className="text-primary-foreground hover:text-primary-glow transition-colors font-medium">Noticias</a>
              {user && (user.role === 'ADMIN_OWNER' || user.role === 'ADMIN_DEVELOPER') && (
                <button
                  onClick={() => navigate('/admin')}
                  className="text-primary-foreground hover:text-primary-glow transition-colors font-semibold"
                >
                  Panel Admin
                </button>
              )}
            </nav>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-primary-foreground flex items-center gap-2">
                  <User className="h-4 w-4" /> {user.name}
                </span>
                <Button
                  onClick={async () => { await signOut(); navigate("/"); }}
                  variant="outline"
                  className="bg-primary-foreground text-primary hover:bg-primary-glow hover:text-primary-foreground border-primary-foreground font-semibold"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="bg-primary-foreground text-primary hover:bg-primary-glow hover:text-primary-foreground border-primary-foreground font-semibold"
                disabled={loading}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
