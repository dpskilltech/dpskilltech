import { PrismaClient } from '@prisma/client';

declare global {
  // Prevent multiple PrismaClient instances during hot-reloading in dev
  // eslint-disable-next-line no-var
  var __dpPrismaClient: PrismaClient | undefined;
}

export const prisma =
  global.__dpPrismaClient ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn']
        : ['error']
  });

if (process.env.NODE_ENV !== 'production') {
  global.__dpPrismaClient = prisma;
}

export interface DbConnectionStatus {
  isConnected: boolean;
  message: string;
  timestamp: string;
  error?: string;
}

/**
 * Validates connectivity to the PostgreSQL database
 */
export async function checkDatabaseConnection(): Promise<DbConnectionStatus> {
  const timestamp = new Date().toISOString();
  try {
    // Perform lightweight query check
    await prisma.$queryRaw`SELECT 1`;
    return {
      isConnected: true,
      message: 'PostgreSQL database connection verified and operational',
      timestamp
    };
  } catch (err: any) {
    return {
      isConnected: false,
      message: 'Database connection failed or database server is currently offline',
      timestamp,
      error: err?.message || String(err)
    };
  }
}
