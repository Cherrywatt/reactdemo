import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '@/lib/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [devToken, setDevToken] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await requestPasswordReset(email);
      toast({ title: 'Solicitud enviada', description: 'Si el correo existe, recibirás instrucciones.' });
      if (res.token) setDevToken(res.token);
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'No se pudo solicitar', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recuperar Contraseña</CardTitle>
          <CardDescription>Ingresa tu correo para restablecer tu contraseña.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Enviar</Button>
          </form>
          {devToken && (
            <div className="mt-4 text-sm">
              <p className="mb-2">Token de desarrollo:</p>
              <code className="text-xs break-all block p-2 bg-muted rounded">{devToken}</code>
              <Button className="mt-3" variant="outline" onClick={() => navigate(`/reset?token=${devToken}`)}>Ir a Reset</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;


