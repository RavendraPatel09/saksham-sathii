import { PrismaClient } from '@prisma/client';

export let prisma: PrismaClient;
export let isDbFallback = false;

try {
  prisma = new PrismaClient({
    log: ['error'],
  });
  
  // Test connection asynchronously
  prisma.$connect()
    .then(() => {
      console.log('✅ Connected to PostgreSQL database via Prisma.');
    })
    .catch((err: any) => {
      console.warn('⚠️ Database connection failed. Swapping to DB FALLBACK (in-memory storage).');
      console.warn('Reason:', err.message);
      isDbFallback = true;
    });
} catch (e: any) {
  console.warn('⚠️ Prisma client initialization failed. Swapping to DB FALLBACK (in-memory storage).');
  isDbFallback = true;
  prisma = {} as any; // Mock placeholder
}
