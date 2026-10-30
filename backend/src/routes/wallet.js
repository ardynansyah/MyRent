import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { config } from '../config.js'

export const walletRouter = Router()

/**
 * Middleware: Verifikasi JWT token & pasang userId ke request.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Token otentikasi wajib disertakan' }
    })
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, config.jwtSecret)
    req.userId = decoded.userId
    req.userRole = String(decoded.role || '').toUpperCase()
    next()
  } catch {
    return res.status(401).json({
      error: { code: 'INVALID_TOKEN', message: 'Token tidak valid atau telah kedaluwarsa' }
    })
  }
}

walletRouter.use(authenticate)

/**
 * GET /api/wallet
 * Mengambil ringkasan saldo, dana ditahan escrow, daftar rekening penarikan,
 * dan riwayat transaksi terkini user yang sedang login.
 */
walletRouter.get('/', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        walletBalance: true,
        kycData: true
      }
    })

    if (!user) {
      return res.status(404).json({
        error: { code: 'USER_NOT_FOUND', message: 'Pengguna tidak ditemukan' }
      })
    }

    // Hitung dana deposit yang sedang ditahan di escrow dari pesanan aktif
    const activeOrders = await prisma.order.findMany({
      where: {
        userId: req.userId,
        status: {
          in: ['MENUNGGU_KONFIRMASI', 'DIKIRIM', 'SEWA_AKTIF', 'INSPEKSI']
        }
      },
      select: { depositAmount: true }
    })

    const escrowHold = activeOrders.reduce((sum, o) => sum + (o.depositAmount || 0), 0)

    // Ambil daftar rekening penarikan terdaftar
    const accounts = await prisma.withdrawalAccount.findMany({
      where: { userId: req.userId },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }]
    })

    // Ambil riwayat mutasi / transaksi dompet
    const transactions = await prisma.walletTransaction.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return res.json({
      walletBalance: user.walletBalance ?? 0,
      escrowHold,
      accounts,
      transactions,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/wallet/topup
 * Menambahkan saldo dompet digital user.
 */
walletRouter.post('/topup', async (req, res, next) => {
  try {
    const { amount, paymentMethod = 'QRIS' } = req.body
    const numericAmount = Number(amount)

    if (!numericAmount || isNaN(numericAmount) || numericAmount < 10000) {
      return res.status(400).json({
        error: { code: 'INVALID_AMOUNT', message: 'Nominal top up minimal Rp 10.000' }
      })
    }

    if (numericAmount > 50000000) {
      return res.status(400).json({
        error: { code: 'AMOUNT_EXCEEDED', message: 'Nominal top up maksimal Rp 50.000.000 per transaksi' }
      })
    }

    const reference = `TOPUP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`

    // Eksekusi transaksi penambahan saldo dan pencatatan mutasi
    const [updatedUser, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: req.userId },
        data: {
          walletBalance: {
            increment: numericAmount
          }
        },
        select: { walletBalance: true }
      }),
      prisma.walletTransaction.create({
        data: {
          userId: req.userId,
          type: 'TOPUP',
          amount: numericAmount,
          description: `Top Up Saldo via ${paymentMethod}`,
          status: 'BERHASIL',
          reference,
          paymentMethod
        }
      })
    ])

    return res.status(201).json({
      message: 'Top up saldo berhasil',
      newBalance: updatedUser.walletBalance,
      transaction
    })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/wallet/withdraw
 * Melakukan penarikan saldo ke rekening pencairan yang sudah didaftarkan.
 */
walletRouter.post('/withdraw', async (req, res, next) => {
  try {
    const { amount, accountId, notes } = req.body
    const numericAmount = Number(amount)

    if (!numericAmount || isNaN(numericAmount) || numericAmount < 10000) {
      return res.status(400).json({
        error: { code: 'INVALID_AMOUNT', message: 'Nominal penarikan minimal Rp 10.000' }
      })
    }

    // Ambil data user terkini untuk validasi saldo
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { walletBalance: true }
    })

    if (!user || user.walletBalance < numericAmount) {
      return res.status(400).json({
        error: {
          code: 'INSUFFICIENT_BALANCE',
          message: `Saldo tidak mencukupi. Saldo saat ini: Rp ${Number(user?.walletBalance || 0).toLocaleString('id-ID')}`
        }
      })
    }

    // Cek rekening tujuan penarikan
    let account = null
    if (accountId) {
      account = await prisma.withdrawalAccount.findFirst({
        where: { id: accountId, userId: req.userId }
      })
    } else {
      account = await prisma.withdrawalAccount.findFirst({
        where: { userId: req.userId, isPrimary: true }
      }) || await prisma.withdrawalAccount.findFirst({
        where: { userId: req.userId }
      })
    }

    if (!account) {
      return res.status(400).json({
        error: {
          code: 'ACCOUNT_REQUIRED',
          message: 'Pilih atau daftarkan rekening penarikan tujuan terlebih dahulu'
        }
      })
    }

    const reference = `WD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
    const description = `Pencairan dana ke ${account.bankName} - ${account.accountNumber} (a.n. ${account.accountHolder})`

    // Eksekusi penarikan: kurangi saldo dan catat transaksi
    const [updatedUser, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: req.userId },
        data: {
          walletBalance: {
            decrement: numericAmount
          }
        },
        select: { walletBalance: true }
      }),
      prisma.walletTransaction.create({
        data: {
          userId: req.userId,
          type: 'WITHDRAW',
          amount: numericAmount,
          description,
          status: 'BERHASIL',
          reference,
          paymentMethod: account.bankName
        }
      })
    ])

    return res.json({
      message: 'Penarikan saldo berhasil diproses',
      newBalance: updatedUser.walletBalance,
      transaction,
      destinationAccount: account
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/wallet/accounts
 * Mengambil daftar rekening penarikan milik user.
 */
walletRouter.get('/accounts', async (req, res, next) => {
  try {
    const accounts = await prisma.withdrawalAccount.findMany({
      where: { userId: req.userId },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }]
    })

    return res.json({ accounts })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/wallet/accounts
 * Mendaftarkan rekening penarikan baru.
 */
walletRouter.post('/accounts', async (req, res, next) => {
  try {
    const { bankName, accountNumber, accountHolder, isPrimary = false } = req.body

    const cleanBank = bankName ? String(bankName).trim() : ''
    const cleanNumber = accountNumber ? String(accountNumber).trim() : ''
    const cleanHolder = accountHolder ? String(accountHolder).trim() : ''

    if (!cleanBank) {
      return res.status(400).json({
        error: { code: 'BANK_NAME_REQUIRED', message: 'Nama bank atau e-wallet wajib diisi' }
      })
    }

    if (!cleanNumber || cleanNumber.length < 5) {
      return res.status(400).json({
        error: { code: 'ACCOUNT_NUMBER_INVALID', message: 'Nomor rekening / e-wallet tidak valid' }
      })
    }

    if (!cleanHolder) {
      return res.status(400).json({
        error: { code: 'ACCOUNT_HOLDER_REQUIRED', message: 'Nama pemilik rekening wajib diisi' }
      })
    }

    // Cek apakah user sudah punya rekening penarikan sebelumnya
    const totalExisting = await prisma.withdrawalAccount.count({
      where: { userId: req.userId }
    })

    const shouldBePrimary = isPrimary || totalExisting === 0

    if (shouldBePrimary && totalExisting > 0) {
      await prisma.withdrawalAccount.updateMany({
        where: { userId: req.userId },
        data: { isPrimary: false }
      })
    }

    const newAccount = await prisma.withdrawalAccount.create({
      data: {
        userId: req.userId,
        bankName: cleanBank,
        accountNumber: cleanNumber,
        accountHolder: cleanHolder,
        isPrimary: shouldBePrimary
      }
    })

    return res.status(201).json({
      message: 'Rekening penarikan berhasil didaftarkan',
      account: newAccount
    })
  } catch (error) {
    next(error)
  }
})

/**
 * PATCH /api/wallet/accounts/:id
 * Mengupdate rekening penarikan atau mengubahnya menjadi rekening utama.
 */
walletRouter.patch('/accounts/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { bankName, accountNumber, accountHolder, isPrimary } = req.body

    const existing = await prisma.withdrawalAccount.findFirst({
      where: { id, userId: req.userId }
    })

    if (!existing) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Rekening penarikan tidak ditemukan' }
      })
    }

    if (isPrimary) {
      await prisma.withdrawalAccount.updateMany({
        where: { userId: req.userId },
        data: { isPrimary: false }
      })
    }

    const updated = await prisma.withdrawalAccount.update({
      where: { id },
      data: {
        ...(bankName ? { bankName: String(bankName).trim() } : {}),
        ...(accountNumber ? { accountNumber: String(accountNumber).trim() } : {}),
        ...(accountHolder ? { accountHolder: String(accountHolder).trim() } : {}),
        ...(typeof isPrimary === 'boolean' ? { isPrimary } : {})
      }
    })

    return res.json({
      message: 'Rekening penarikan berhasil diperbarui',
      account: updated
    })
  } catch (error) {
    next(error)
  }
})

/**
 * DELETE /api/wallet/accounts/:id
 * Menghapus rekening penarikan.
 */
walletRouter.delete('/accounts/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    const existing = await prisma.withdrawalAccount.findFirst({
      where: { id, userId: req.userId }
    })

    if (!existing) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Rekening penarikan tidak ditemukan' }
      })
    }

    await prisma.withdrawalAccount.delete({
      where: { id }
    })

    // Jika rekening yang dihapus adalah rekening utama, jadikan rekening lain sebagai utama
    if (existing.isPrimary) {
      const another = await prisma.withdrawalAccount.findFirst({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' }
      })
      if (another) {
        await prisma.withdrawalAccount.update({
          where: { id: another.id },
          data: { isPrimary: true }
        })
      }
    }

    return res.json({
      message: 'Rekening penarikan berhasil dihapus'
    })
  } catch (error) {
    next(error)
  }
})
