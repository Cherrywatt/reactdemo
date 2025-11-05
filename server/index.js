import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const COOKIE_NAME = 'auth_token';

app.use(express.json());
app.use(cookieParser());
// Mailer (SMTP opcional). Si no hay config, modo dev que solo loguea y devuelve token en API
const mailerEnabled = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.MAIL_FROM);
const transporter = mailerEnabled ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
}) : null;

async function sendMail(to, subject, html) {
  if (!mailerEnabled || !transporter) {
    console.log('[DEV MAIL]', { to, subject, html });
    return;
  }
  await transporter.sendMail({ from: process.env.MAIL_FROM, to, subject, html });
}


function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // Cambiar a true en producción con HTTPS
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
    path: '/',
  });
}

function authMiddleware(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'No autenticado' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos' });
  }
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email ya registrado' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, passwordHash } });

    // Crear token de verificación (24h)
    const verifyToken = crypto.randomBytes(24).toString('hex');
    const verifyExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await prisma.emailVerification.create({ data: { token: verifyToken, userId: user.id, expiresAt: verifyExpires } });

    const verifyUrl = `${process.env.PUBLIC_BASE_URL || 'http://localhost:8080'}/verify?token=${verifyToken}`;
    await sendMail(user.email, 'Verifica tu cuenta', `<p>Hola ${user.name},</p><p>Verifica tu cuenta haciendo clic en: <a href="${verifyUrl}">${verifyUrl}</a></p>`);

    // No iniciar sesión automática si quieres forzar verificación; aquí mantenemos el flujo actual pero marcamos estado
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    setAuthCookie(res, token);
    return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error de servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Cuenta no verificada. Revisa tu correo o solicita un nuevo enlace.' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    setAuthCookie(res, token);
    return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error de servidor' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'No encontrado' });
    return res.json({ id: user.id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error de servidor' });
  }
});

function adminOnly(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'No autenticado' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'ADMIN_OWNER' && payload.role !== 'ADMIN_DEVELOPER') {
      return res.status(403).json({ error: 'Requiere rol administrador' });
    }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Endpoint de ejemplo solo para admins: listar usuarios (id, name, email, role)
app.get('/api/admin/users', adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true, passwordHash: true } });
    return res.json(users);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error de servidor' });
  }
});

// Reset de contraseña por un administrador
app.post('/api/admin/users/:id/reset-password', adminOnly, async (req, res) => {
  const userId = Number(req.params.id);
  const { newPassword } = req.body || {};
  if (!userId || !newPassword || String(newPassword).length < 6) {
    return res.status(400).json({ error: 'Datos inválidos (mínimo 6 caracteres)' });
  }
  try {
    const exists = await prisma.user.findUnique({ where: { id: userId } });
    if (!exists) return res.status(404).json({ error: 'Usuario no encontrado' });
    const passwordHash = await bcrypt.hash(String(newPassword), 10);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error de servidor' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  return res.json({ ok: true });
});

// Solicitar reset: genera token y (en producción) enviaría email. Aquí lo devolvemos para pruebas.
app.post('/api/auth/request-reset', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email requerido' });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    // Respuesta genérica para no filtrar existencia
    if (!user) return res.json({ ok: true });
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 min
    await prisma.passwordReset.create({ data: { token, userId: user.id, expiresAt } });
    // En Dev devolvemos el token para que lo uses en /reset
    return res.json({ ok: true, token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error de servidor' });
  }
});

// Consumir reset: validar token, actualizar contraseña, invalidar token, crear nueva sesión
app.post('/api/auth/reset', async (req, res) => {
  const { token, newPassword } = req.body || {};
  if (!token || !newPassword) return res.status(400).json({ error: 'Datos incompletos' });
  try {
    const pr = await prisma.passwordReset.findUnique({ where: { token } });
    if (!pr || pr.used || pr.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const user = await prisma.user.update({ where: { id: pr.userId }, data: { passwordHash } });
    await prisma.passwordReset.update({ where: { token }, data: { used: true } });
    const jwtToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    setAuthCookie(res, jwtToken);
    return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error de servidor' });
  }
});

// Verificación de email
app.get('/api/auth/verify', async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).json({ error: 'Token requerido' });
  try {
    const ev = await prisma.emailVerification.findUnique({ where: { token: String(token) } });
    if (!ev || ev.used || ev.expiresAt < new Date()) return res.status(400).json({ error: 'Token inválido o expirado' });
    await prisma.user.update({ where: { id: ev.userId }, data: { isVerified: true } });
    await prisma.emailVerification.update({ where: { token: String(token) }, data: { used: true } });
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error de servidor' });
  }
});

// Re-enviar verificación
app.post('/api/auth/verify-request', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email requerido' });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ ok: true }); // no revelar
    if (user.isVerified) return res.json({ ok: true });
    const verifyToken = crypto.randomBytes(24).toString('hex');
    const verifyExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await prisma.emailVerification.create({ data: { token: verifyToken, userId: user.id, expiresAt: verifyExpires } });
    const verifyUrl = `${process.env.PUBLIC_BASE_URL || 'http://localhost:8080'}/verify?token=${verifyToken}`;
    await sendMail(user.email, 'Verifica tu cuenta', `<p>Verifica tu cuenta: <a href="${verifyUrl}">${verifyUrl}</a></p>`);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error de servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});


