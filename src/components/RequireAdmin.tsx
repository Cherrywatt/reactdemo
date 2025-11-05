import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export default function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  const isAdmin = user && (user.role === 'ADMIN_OWNER' || user.role === 'ADMIN_DEVELOPER');
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}


