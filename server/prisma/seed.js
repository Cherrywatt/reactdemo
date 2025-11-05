import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function ensureAdmin(email, name, password, role) {
  if (!email || !password) return;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, name, passwordHash, role } });
}

async function main() {
  await ensureAdmin(
    process.env.ADMIN_OWNER_EMAIL,
    process.env.ADMIN_OWNER_NAME || 'Owner',
    process.env.ADMIN_OWNER_PASSWORD,
    'ADMIN_OWNER'
  );
  await ensureAdmin(
    process.env.ADMIN_DEV_EMAIL,
    process.env.ADMIN_DEV_NAME || 'Developer',
    process.env.ADMIN_DEV_PASSWORD,
    'ADMIN_DEVELOPER'
  );
  console.log('Seed completado.');
}

main().finally(async () => {
  await prisma.$disconnect();
});


