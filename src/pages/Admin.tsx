import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  passwordHash: string;
}

const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<number | null>(null);
  const [newPasswords, setNewPasswords] = useState<Record<number, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/users', { credentials: 'include' });
        if (!res.ok) throw new Error('No autorizado o error al cargar');
        const data = await res.json();
        setUsers(data);
      } catch (e: any) {
        setError(e?.message || 'Error');
      }
    };
    load();
  }, []);

  const resetPasswordForUser = async (userId: number) => {
    const pwd = newPasswords[userId] || '';
    if (!pwd || pwd.length < 6) {
      alert('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    setResettingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newPassword: pwd })
      });
      if (!res.ok) throw new Error('No se pudo resetear');
      // Refrescar lista para ver nuevo hash
      const refreshed = await fetch('/api/admin/users', { credentials: 'include' });
      const data = await refreshed.json();
      setUsers(data);
      setNewPasswords(prev => ({ ...prev, [userId]: '' }));
      alert('Contraseña actualizada');
    } catch (e: any) {
      alert(e?.message || 'Error');
    } finally {
      setResettingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">Panel Admin</h2>
      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">ID</th>
                    <th className="py-2 pr-4">Nombre</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Rol</th>
                    <th className="py-2 pr-4">Creado</th>
                    <th className="py-2 pr-4">Hash Contraseña</th>
                    <th className="py-2 pr-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b">
                      <td className="py-2 pr-4">{u.id}</td>
                      <td className="py-2 pr-4">{u.name}</td>
                      <td className="py-2 pr-4">{u.email}</td>
                      <td className="py-2 pr-4">{u.role}</td>
                      <td className="py-2 pr-4">{new Date(u.createdAt).toLocaleString()}</td>
                      <td className="py-2 pr-4"><code className="text-xs break-all">{u.passwordHash}</code></td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="password"
                            placeholder="Nueva contraseña"
                            className="border rounded px-2 py-1 text-sm"
                            value={newPasswords[u.id] || ''}
                            onChange={e => setNewPasswords(prev => ({ ...prev, [u.id]: e.target.value }))}
                          />
                          <button
                            className="px-3 py-1 text-sm border rounded"
                            onClick={() => resetPasswordForUser(u.id)}
                            disabled={resettingId === u.id}
                          >
                            {resettingId === u.id ? 'Guardando...' : 'Guardar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Admin;


