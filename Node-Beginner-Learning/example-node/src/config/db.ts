import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

export async function connectDB(): Promise<void> {
  await prisma.$connect();
  console.log('[db] connected');
}

export async function disconnectDB(): Promise<void> {
  await prisma.$disconnect();
}
