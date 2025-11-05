import { execSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

function run(cmd) {
  console.log(`> ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', shell: true });
  } catch (e) {
    console.warn(`Command failed (continuing): ${cmd}`);
  }
}

function removePath(p) {
  if (existsSync(p)) {
    console.log(`Removing ${p}`);
    rmSync(p, { recursive: true, force: true });
  }
}

async function main() {
  // Kill node processes on Windows to release DLL locks
  if (process.platform === 'win32') {
    run('taskkill /F /IM node.exe');
  }

  // Clean prisma engine caches in node_modules
  removePath(join(process.cwd(), 'node_modules', '.prisma'));
  removePath(join(process.cwd(), 'node_modules', '@prisma', 'engines'));

  // Full reinstall
  removePath(join(process.cwd(), 'node_modules'));
  removePath(join(process.cwd(), 'package-lock.json'));

  run('npm install');

  // Ensure versions match and are present
  run('npm i -D prisma@5.22.0');
  run('npm i @prisma/client@5.22.0');

  // Generate client with debug for better logs
  run('npx prisma generate --debug');

  console.log('Prisma fix complete. You can run migrations now: npm run prisma:migrate');
}

main();


