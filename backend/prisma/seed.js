import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

/**
 * Data demo pengajuan KYC.
 *
 * Dipakai supaya Portal Verifikasi Admin langsung punya data nyata
 * (bukan dummy di frontend) saat pertama kali dijalankan.
 * `update: {}` dipakai agar keputusan admin yang sudah tersimpan
 * tidak tertimpa ketika seed dijalankan ulang.
 */
const DEMO_PENYEWA = {
  email: 'demo.penyewa@myrent.id',
  role: 'PENYEWA',
  fullName: 'Andini Rahmawati',
  phone: '082144557788',
  password: 'Password123!',
  submissionCode: 'VR-9001',
  kycData: {
    fullName: 'Andini Rahmawati',
    email: 'demo.penyewa@myrent.id',
    phone: '082144557788',
    businessName: 'Dapur Roti Andini',
    businessSector: 'Makanan & Minuman',
    nik: '7371042588900003',
    ktpName: 'Andini Rahmawati',
    birthPlace: 'Makassar',
    birthDate: '1994-04-12',
    ktpFile: { name: 'ktp-andini.jpg', size: 1887436, type: 'image/jpeg' },
    selfieFile: { name: 'selfie-ktp.jpg', size: 1258291, type: 'image/jpeg' },
    nib: '8120019456723',
    startYear: '2019',
    powerCapacity: '2200 W',
    isManualPower: false,
    businessDesc:
      'Dapur produksi roti dan kue kering dengan 4 karyawan, kapasitas produksi 120 kg adonan per hari.',
    address: 'Jl. Rappocini Raya No. 44, RT 05/RW 03,usation, Panakkukang',
    city: 'Makassar',
    district: 'Panakkukang',
    postalCode: '90231',
    landmark: 'Samping Yanniko Bakery',
    gpsCoords: '-5.1477, 119.4329',
    bankName: 'BCA — Bank Central Asia',
    bankAccount: '8830112447',
    bankAccountHolder: 'Andini Rahmawati',
    confirmAccountOwner: true,
    confirmDeduction: true,
    agreeTruth: true,
    agreeTerms: true
  }
}

const DEMO_PEMILIK = {
  email: 'demo.pemilik@myrent.id',
  role: 'PEMILIK',
  fullName: 'Budi Santoso',
  phone: '081288990011',
  password: 'Password123!',
  submissionCode: 'VR-9002',
  kycData: {
    email: 'demo.pemilik@myrent.id',
    whatsapp: '081288990011',
    nik: '3174092188450003',
    namaKtp: 'Budi Santoso',
    tempatLahir: 'Jakarta',
    tanggalLahir: '1991-04-12',
    badanUsaha: 'Perorangan',
    npwp: '09.254.294.3-407.000',
    namaLokasi: 'Gudang Produksi Cilandak',
    alamat: 'Jl. Cilandak Tengah No. 24, RT 04/RW 06, Cilandak Barat, Jakarta Selatan 12430',
    kota: 'Jakarta Selatan',
    kodePos: '12430',
    gps: '(-6.2891, 106.8001)',
    hariOperasional: 'Senin - Sabtu',
    jamBuka: '08:00',
    jamTutup: '18:00',
    fasilitasJaga: true,
    fasilitasParkir: true,
    fasilitasDalamRuangan: true,
    ktpFile: { name: 'ktp-pemilik.jpg', size: 2048000, type: 'image/jpeg' },
    selfieFile: { name: 'selfie-pemilik.jpg', size: 1400000, type: 'image/jpeg' },
    frontPhoto: { name: 'gudang-depan.jpg', size: 1600000, type: 'image/jpeg' },
    storagePhoto: { name: 'gudang-area-penyimpanan.jpg', size: 2000000, type: 'image/jpeg' },
    bank: 'BCA — Bank Central Asia',
    nomorRekening: '44718890221',
    namaRekening: 'Budi Santoso',
    konfirmasiKepemilikan: true,
    konfirmasiKomisi: true,
    agreeTerms: true,
    agreeEscrow: true,
    agreeTruth: true
  }
}

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

  // 3. Contoh pengajuan KYC (Penyewa & Pemilik) untuk portal verifikasi admin.
  //    Password kedua akun: 'Password123!' (hash dihitung terpisah).
  const demoPassword = await bcrypt.hash('Password123!', 10)

  const demoPenyewa = await prisma.user.upsert({
    where: { email: DEMO_PENYEWA.email },
    update: {},
    create: {
      email: DEMO_PENYEWA.email,
      password: demoPassword,
      role: DEMO_PENYEWA.role,
      fullName: DEMO_PENYEWA.fullName,
      phone: DEMO_PENYEWA.phone,
      submissionCode: DEMO_PENYEWA.submissionCode,
      verificationStatus: 'MENUNGGU',
      kycData: DEMO_PENYEWA.kycData
    }
  })

  const demoPemilik = await prisma.user.upsert({
    where: { email: DEMO_PEMILIK.email },
    update: {},
    create: {
      email: DEMO_PEMILIK.email,
      password: demoPassword,
      role: DEMO_PEMILIK.role,
      fullName: DEMO_PEMILIK.fullName,
      phone: DEMO_PEMILIK.phone,
      submissionCode: DEMO_PEMILIK.submissionCode,
      verificationStatus: 'MENUNGGU',
      kycData: DEMO_PEMILIK.kycData
    }
  })

  console.log('✅ Database Seeder Berhasil:')
  console.log(`  - Admin Utama : ${defaultAdmin.email} (Role: ${defaultAdmin.role})`)
  console.log(`  - Admin Template: ${templateAdmin.email} (Role: ${templateAdmin.role})`)
  console.log(`  - Password Default: ${adminPassword}`)
  console.log(`  - Demo Pengajuan Penyewa: ${demoPenyewa.submissionCode} (${demoPenyewa.email})`)
  console.log(`  - Demo Pengajuan Pemilik: ${demoPemilik.submissionCode} (${demoPemilik.email})`)
  console.log('    Password akun demo: Password123!')
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
