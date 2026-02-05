import { PrismaClient } from '@prisma/client';

// PrismaClient ko bina kisi complex options ke initialize karein
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;