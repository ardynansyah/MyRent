import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()


async function main() {
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin#Sewa2026'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  // 1. Akun Admin Default Utama
  const defaultAdmin = await prisma.user.upsert({
    where: { email: 'admin@myrent.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      fullName: 'Super Administrator MyRent',
      phone: '081234567890'
    },
    create: {
      email: 'admin@myrent.com',
      password: hashedPassword,
      role: 'ADMIN',
      fullName: 'Super Administrator MyRent',
      phone: '081234567890'
    }
  })

  // 2. Akun Admin Alternatif sesuai template desain UI (rani.admin@gmail.com)
  const templateAdmin = await prisma.user.upsert({
    where: { email: 'rani.admin@gmail.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      fullName: 'Rani Admin',
      phone: '081298765432'
    },
    create: {
      email: 'rani.admin@gmail.com',
      password: hashedPassword,
      role: 'ADMIN',
      fullName: 'Rani Admin',
      phone: '081298765432'
    }
  })

  console.log('✅ Database Seeder Berhasil:')
  console.log(`  - Admin Utama : ${defaultAdmin.email} (Role: ${defaultAdmin.role})`)
  console.log(`  - Admin Template: ${templateAdmin.email} (Role: ${templateAdmin.role})`)
  console.log(`  - Password Default: ${adminPassword}`)
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
