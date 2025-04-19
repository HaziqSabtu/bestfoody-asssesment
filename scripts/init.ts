// create a .env file in the root directory
// and add the following content
// DATABASE_URL=file:./dev.db

import fs from 'fs';
import path from 'path';

const dotenvPath = path.resolve(process.cwd(), '.env');

if (!fs.existsSync(dotenvPath)) {
  fs.writeFileSync(dotenvPath, `DATABASE_URL=file:./dev.db`);
} else {
  console.log('dotenv file already exists');
}

// check if prisma/dev.db exists
// if not, run prisma migrate dev
const prismaPath = path.resolve(process.cwd(), 'prisma');
const prismaDevDbPath = path.resolve(prismaPath, 'dev.db');

import { execSync } from 'child_process';
if (!fs.existsSync(prismaDevDbPath)) {
  console.log('prisma/dev.db does not exist, running prisma migrate dev');
  execSync('npx prisma migrate dev');
  execSync('npm run seed');
}
