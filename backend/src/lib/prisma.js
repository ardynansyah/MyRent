import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// Instance global mencegah connection pool exhaustion saat hot-reload di development.
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
