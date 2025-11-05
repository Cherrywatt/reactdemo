import RequireAdmin from '@/components/RequireAdmin';

const AdminOnly = () => {
  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-4">Zona Exclusiva de Administradores</h2>
      <p className="text-muted-foreground">Solo visible en modo administrador.</p>
    </div>
  );
};

export default function AdminOnlyPage() {
  return (
    <RequireAdmin>
      <AdminOnly />
    </RequireAdmin>
  );
}


