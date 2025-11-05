import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { resetPassword } from '@/lib/auth';

const ResetPassword = () => {
  const [sp] = useSearchParams();
  const token = sp.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast({ title: 'Token faltante', description: 'Vuelve a solicitar el reseteo', variant: 'destructive' });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!password || password.length < 6 || password !== confirm) {
      toast({ title: 'Error', description: 'Contraseña inválida o no coincide', variant: 'destructive' });
      return;
    }
    try {
      await resetPassword(token, password);
      toast({ title: 'Contraseña actualizada', description: 'Has iniciado sesión automáticamente' });
      navigate('/');
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'No se pudo resetear', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Restablecer Contraseña</CardTitle>
          <CardDescription>Ingresa una nueva contraseña.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar</Label>
              <Input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Actualizar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;


