import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

/**
 * Seeder MyRent.
 *
 * 1. Akun admin default (utama + template desain UI).
 * 2. Satu akun PEMILIK dummy yang dipakai pemilik data katalog alat.
 * 3. Lima unit alat berstatus TERSEDIA + satu unit DISEWA (kontrol status filter).
 *
 * Semua id ditulis eksplisit supaya seeder aman dijalankan berulang kali
 * (idempotent) — tidakMenduplikasi data katalog.
 */

const PEMILIK_ID = '11111111-1111-4111-8111-111111111111'
const PEMILIK_EMAIL = 'pemilik@myrent.com'
const PEMILIK_PASSWORD = 'Pemilik#Sewa2026'

const PENYEWA_ID = '22222222-2222-4222-8222-222222222222'
const PENYEWA_EMAIL = 'penyewa@myrent.com'
const PENYEWA_PASSWORD = 'Penyewa#Sewa2026'

const EQUIPMENTS = [
  {
    id: 'a1000000-0000-4000-8000-000000000001',
    name: 'Espresso Machine La Marzocco GS3',
    category: 'Mesin Kopi',
    description:
      'Mesin espresso single group dengan boiler stainless, PID presisi, dan steam wand ganda untuk susu. Stabil untuk produksi 80-120 cangkir per hari. Sudah termasuk portafilter 58 mm, tamper, dan pitcher susu.',
    pricePerDay: 150000,
    deposit: 500000,
    powerWatt: 1300,
    weightKg: 45,
    dimensions: '58 × 49 × 41 cm',
    maintenanceBufferDays: 1,
    location: 'Kec. Cilandak, Jakarta Selatan',
    distance: 2.4,
    status: 'TERSEDIA',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'a1000000-0000-4000-8000-000000000002',
    name: 'Oven Deck Bakery 2 Pintu',
    category: 'Oven & Bakery',
    description:
      'Oven deck gas dengan dua pintu, stone deck, dan timer digital per kanal. Kapasitas 6 loyang 40 x 60 cm per siklus, cocok untuk roti, cake, dan pastry produksi harian.',
    pricePerDay: 210000,
    deposit: 750000,
    powerWatt: 1200,
    weightKg: 85,
    dimensions: '90 × 70 × 60 cm',
    maintenanceBufferDays: 1,
    location: 'Kec. Kebayoran Baru, Jakarta Selatan',
    distance: 3.1,
    status: 'TERSEDIA',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'a1000000-0000-4000-8000-000000000003',
    name: 'Mesin Kemasan Vakum Otomatis',
    category: 'Mesin Kemasan',
    description:
      'Mesin vakum untuk kemasan food grade dengan pompa dry oil-free, chamber 400 x 320 mm, dan seal dua sisi. Digunakan untuk mengawetkan produk setengah jadi seperti keripik dan kacang.',
    pricePerDay: 95000,
    deposit: 300000,
    powerWatt: 900,
    weightKg: 28,
    dimensions: '45 × 35 × 30 cm',
    maintenanceBufferDays: 1,
    location: 'Kec. Tebet, Jakarta Selatan',
    distance: 1.2,
    status: 'TERSEDIA',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'a1000000-0000-4000-8000-000000000004',
    name: 'Mesin Jahit Industri Juki DDL-8700',
    category: 'Konveksi',
    description:
      'Mesin jahit direct drive satu jarum dengan motor servo 550 W, 21 jenis pola jahitan, dan pedal elektronik. Cocok untuk produksi kemeja dan seragam UMKM.',
    pricePerDay: 75000,
    deposit: 400000,
    powerWatt: 400,
    weightKg: 12,
    dimensions: '55 × 25 × 35 cm',
    maintenanceBufferDays: 2,
    location: 'Kec. Pasar Minggu, Jakarta Selatan',
    distance: 5.8,
    status: 'TERSEDIA',
    images: [
      'https://images.unsplash.com/photo-1528458876885-5b6eacdd3671?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'a1000000-0000-4000-8000-000000000005',
    name: 'Mixer Planetary 20 Liter',
    category: 'Oven & Bakery',
    description:
      'Mixer planetary 20 liter dengan gearbox tiga kecepatan, pengaduk spiral, dan timer. Digunakan untuk adonan kue, roti, dan batch produksi hingga 20 kg per batch.',
    pricePerDay: 120000,
    deposit: 350000,
    powerWatt: 1100,
    weightKg: 24,
    dimensions: '40 × 30 × 55 cm',
    maintenanceBufferDays: 1,
    location: 'Kec. Kebayoran Baru, Jakarta Selatan',
    distance: 4.0,
    status: 'TERSEDIA',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'a1000000-0000-4000-8000-000000000006',
    name: 'Mesin Espresso Otomatis 2 Grup',
    category: 'Mesin Kopi',
    description:
      'Mesin espresso 2 grup dengan sistem PID dan dual boiler, stabil untuk produksi 150–200 cangkir per hari. Sudah termasuk portafilter, tamper, dan pitcher susu. Perawatan rutin dilakukan setiap 3 bulan oleh teknisi pemilik.',
    pricePerDay: 320000,
    deposit: 1200000,
    powerWatt: 2200,
    weightKg: 34,
    dimensions: '40 × 53 × 35 cm',
    maintenanceBufferDays: 1,
    location: 'Kec. Cilandak, Jakarta Selatan',
    distance: 6.5,
    status: 'DISEWA',
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    ]
  }
]

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

  // 3. Akun PEMILIK dummy — pemilik seluruh data katalog alat di bawah.
  const hashedPemilikPassword = await bcrypt.hash(PEMILIK_PASSWORD, 10)
  const pemilik = await prisma.user.upsert({
    where: { email: PEMILIK_EMAIL },
    update: {
      password: hashedPemilikPassword,
      role: 'PEMILIK',
      fullName: 'Kopi Senja Roastery',
      phone: '081211223344',
      verificationStatus: 'DISETUJUI',
      submissionCode: 'VR-1001',
      kycData: {
        businessName: 'Kopi Senja Roastery',
        businessSector: 'Kuliner & Kopi',
        city: 'Jakarta Selatan',
        district: 'Kec. Cilandak',
        address: 'Jl. Raya Cilandak No. 12, Jakarta Selatan',
        startYear: '2019',
        powerCapacity: '> 3500 W',
        customPower: '5000',
        dayaListrik: 5000
      }
    },
    create: {
      id: PEMILIK_ID,
      email: PEMILIK_EMAIL,
      password: hashedPemilikPassword,
      role: 'PEMILIK',
      fullName: 'Kopi Senja Roastery',
      phone: '081211223344',
      verificationStatus: 'DISETUJUI',
      submissionCode: 'VR-1001',
      kycData: {
        businessName: 'Kopi Senja Roastery',
        businessSector: 'Kuliner & Kopi',
        city: 'Jakarta Selatan',
        district: 'Kec. Cilandak',
        address: 'Jl. Raya Cilandak No. 12, Jakarta Selatan',
        startYear: '2019',
        powerCapacity: '> 3500 W',
        customPower: '5000',
        dayaListrik: 5000
      }
    }
  })

  // 4. Akun PENYEWA dummy — dipakai untuk mencoba alur beranda sewa & detail alat.
  const hashedPenyewaPassword = await bcrypt.hash(PENYEWA_PASSWORD, 10)
  const penyewa = await prisma.user.upsert({
    where: { email: PENYEWA_EMAIL },
    update: {
      password: hashedPenyewaPassword,
      role: 'PENYEWA',
      fullName: 'Budi Santoso',
      phone: '081233445566',
      verificationStatus: 'DISETUJUI',
      submissionCode: 'VR-1002',
      kycData: {
        businessName: 'Warung Kopi Nusantara',
        businessSector: 'Kuliner & Kopi',
        city: 'Jakarta Selatan',
        district: 'Kec. Tebet',
        address: 'Jl. Tebet Barat Dalam No. 8, Jakarta Selatan',
        landmark: 'Sebelah Alfamart, depan gang kecil',
        startYear: '2021',
        powerCapacity: '1300 W',
        customPower: '',
        isManualPower: false,
        dayaListrik: 1300,
        bankName: 'Bank BCA',
        bankAccountNumber: '8720345612',
        bankAccountName: 'Budi Santoso'
      }
    },
    create: {
      id: PENYEWA_ID,
      email: PENYEWA_EMAIL,
      password: hashedPenyewaPassword,
      role: 'PENYEWA',
      fullName: 'Budi Santoso',
      phone: '081233445566',
      verificationStatus: 'DISETUJUI',
      submissionCode: 'VR-1002',
      kycData: {
        businessName: 'Warung Kopi Nusantara',
        businessSector: 'Kuliner & Kopi',
        city: 'Jakarta Selatan',
        district: 'Kec. Tebet',
        address: 'Jl. Tebet Barat Dalam No. 8, Jakarta Selatan',
        landmark: 'Sebelah Alfamart, depan gang kecil',
        startYear: '2021',
        powerCapacity: '1300 W',
        customPower: '',
        isManualPower: false,
        dayaListrik: 1300,
        bankName: 'Bank BCA',
        bankAccountNumber: '8720345612',
        bankAccountName: 'Budi Santoso'
      }
    }
  })

  // 5. Data alat milik akun PEMILIK di atas.
  for (const item of EQUIPMENTS) {
    await prisma.equipment.upsert({
      where: { id: item.id },
      update: {
        ownerId: pemilik.id,
        name: item.name,
        category: item.category,
        description: item.description,
        pricePerDay: item.pricePerDay,
        deposit: item.deposit,
        powerWatt: item.powerWatt,
        weightKg: item.weightKg,
        dimensions: item.dimensions,
        maintenanceBufferDays: item.maintenanceBufferDays,
        location: item.location,
        distance: item.distance,
        status: item.status,
        images: item.images
      },
      create: {
        ...item,
        ownerId: pemilik.id
      }
    })
  }

  // 6. Data Order awal untuk penyewa — variasi status agar seluruh tab Pesanan
  //    Saya langsung memiliki data nyata dari MySQL.
  const now = new Date()
  const ORDER_SEEDS = [
    {
      id: 'b2000000-0000-4000-8000-000000000001',
      invoiceNumber: 'INV-2406-018',
      userId: PENYEWA_ID,
      equipmentId: 'a1000000-0000-4000-8000-000000000001',
      startDate: new Date(now.getTime() - 2 * 86400000),
      endDate: new Date(now.getTime() + 5 * 86400000),
      rentalDays: 7,
      deliveryMethod: 'COURIER',
      rentalCost: 1050000,
      shippingCost: 45000,
      depositAmount: 500000,
      totalPaid: 1595000,
      status: 'SEWA_AKTIF'
    },
    {
      id: 'b2000000-0000-4000-8000-000000000002',
      invoiceNumber: 'INV-2406-021',
      userId: PENYEWA_ID,
      equipmentId: 'a1000000-0000-4000-8000-000000000002',
      startDate: new Date(now.getTime() + 3 * 86400000),
      endDate: new Date(now.getTime() + 7 * 86400000),
      rentalDays: 4,
      deliveryMethod: 'PICKUP',
      rentalCost: 840000,
      shippingCost: 0,
      depositAmount: 750000,
      totalPaid: 1590000,
      status: 'MENUNGGU_KONFIRMASI'
    },
    {
      id: 'b2000000-0000-4000-8000-000000000003',
      invoiceNumber: 'INV-2406-024',
      userId: PENYEWA_ID,
      equipmentId: 'a1000000-0000-4000-8000-000000000003',
      startDate: new Date(now.getTime() + 1 * 86400000),
      endDate: new Date(now.getTime() + 4 * 86400000),
      rentalDays: 3,
      deliveryMethod: 'COURIER',
      rentalCost: 285000,
      shippingCost: 35000,
      depositAmount: 300000,
      totalPaid: 620000,
      status: 'DIKIRIM'
    },
    {
      id: 'b2000000-0000-4000-8000-000000000004',
      invoiceNumber: 'INV-2406-030',
      userId: PENYEWA_ID,
      equipmentId: 'a1000000-0000-4000-8000-000000000004',
      startDate: new Date(now.getTime() - 10 * 86400000),
      endDate: new Date(now.getTime() - 3 * 86400000),
      rentalDays: 7,
      deliveryMethod: 'COURIER',
      rentalCost: 525000,
      shippingCost: 40000,
      depositAmount: 400000,
      totalPaid: 965000,
      status: 'DISPUTE',
      disputeNote: 'Penyewa melaporkan kerusakan pada pedal elektronik saat penggunaan hari ke-5.'
    }
  ]

  for (const order of ORDER_SEEDS) {
    await prisma.order.upsert({
      where: { id: order.id },
      update: {
        invoiceNumber: order.invoiceNumber,
        userId: order.userId,
        equipmentId: order.equipmentId,
        startDate: order.startDate,
        endDate: order.endDate,
        rentalDays: order.rentalDays,
        deliveryMethod: order.deliveryMethod,
        rentalCost: order.rentalCost,
        shippingCost: order.shippingCost,
        depositAmount: order.depositAmount,
        totalPaid: order.totalPaid,
        status: order.status,
        disputeNote: order.disputeNote ?? null
      },
      create: order
    })
  }

  console.log('✅ Database Seeder Berhasil:')
  console.log(`  - Admin Utama   : ${defaultAdmin.email} (Role: ${defaultAdmin.role})`)
  console.log(`  - Admin Template: ${templateAdmin.email} (Role: ${templateAdmin.role})`)
  console.log(`  - Pemilik Katalog: ${pemilik.email} (Role: ${pemilik.role})`)
  console.log(`  - Penyewa Demo   : ${penyewa.email} (Role: ${penyewa.role}, daya ${penyewa.kycData?.dayaListrik} W)`)
  console.log(`  - Password Admin : ${adminPassword}`)
  console.log(`  - Password Pemilik: ${PEMILIK_PASSWORD}`)
  console.log(`  - Password Penyewa: ${PENYEWA_PASSWORD}`)
  console.log(`  - Equipment      : ${EQUIPMENTS.length} unit (${EQUIPMENTS.filter((e) => e.status === 'TERSEDIA').length} TERSEDIA)`)
  console.log(`  - Orders         : ${ORDER_SEEDS.length} pesanan demo`)
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

