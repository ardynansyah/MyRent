import { getUserToken, getSessionUser, setUserSession } from './userSession'

export const API_BASE = 'http://localhost:3000/api'

/**
 * Dispatch event global bila ada perubahan saldo (Top Up / Tarik Saldo)
 * supaya seluruh komponen (Navbar, Card, Modal) sinkron seketika.
 */
export function emitWalletUpdate(newBalance) {
  try {
    const user = getSessionUser()
    if (user && newBalance !== undefined) {
      user.walletBalance = newBalance
      setUserSession(null, user)
    }
    window.dispatchEvent(
      new CustomEvent('myrent:wallet-updated', {
        detail: { newBalance }
      })
    )
  } catch {
    // abaikan di SSR/lingkungan tanpa window
  }
}

/**
 * Mengambil informasi dompet lengkap: saldo, escrow, rekening, & riwayat mutasi
 */
export async function getWalletInfo() {
  const token = getUserToken()
  if (!token) throw new Error('Harap masuk terlebih dahulu')

  const response = await fetch(`${API_BASE}/wallet`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error?.message || 'Gagal memuat data dompet')
  }

  // Update session storage jika saldo berubah di backend
  if (data.walletBalance !== undefined) {
    const user = getSessionUser()
    if (user && user.walletBalance !== data.walletBalance) {
      user.walletBalance = data.walletBalance
      setUserSession(null, user)
    }
  }

  return data
}

/**
 * Melakukan Top Up saldo
 */
export async function topUpWallet({ amount, paymentMethod = 'QRIS' }) {
  const token = getUserToken()
  if (!token) throw new Error('Harap masuk terlebih dahulu')

  const response = await fetch(`${API_BASE}/wallet/topup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ amount: Number(amount), paymentMethod })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error?.message || 'Gagal melakukan top up')
  }

  emitWalletUpdate(data.newBalance)
  return data
}

/**
 * Melakukan penarikan saldo ke rekening terdaftar
 */
export async function withdrawWallet({ amount, accountId, notes }) {
  const token = getUserToken()
  if (!token) throw new Error('Harap masuk terlebih dahulu')

  const response = await fetch(`${API_BASE}/wallet/withdraw`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      amount: Number(amount),
      accountId,
      notes
    })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error?.message || 'Gagal memproses penarikan saldo')
  }

  emitWalletUpdate(data.newBalance)
  return data
}

/**
 * Mengambil daftar rekening penarikan terdaftar
 */
export async function getWithdrawalAccounts() {
  const token = getUserToken()
  if (!token) throw new Error('Harap masuk terlebih dahulu')

  const response = await fetch(`${API_BASE}/wallet/accounts`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error?.message || 'Gagal memuat rekening penarikan')
  }

  return data.accounts || []
}

/**
 * Mendaftarkan rekening penarikan baru
 */
export async function createWithdrawalAccount({
  bankName,
  accountNumber,
  accountHolder,
  isPrimary = false
}) {
  const token = getUserToken()
  if (!token) throw new Error('Harap masuk terlebih dahulu')

  const response = await fetch(`${API_BASE}/wallet/accounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      bankName,
      accountNumber,
      accountHolder,
      isPrimary
    })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error?.message || 'Gagal mendaftarkan rekening penarikan')
  }

  return data
}

/**
 * Memperbarui rekening penarikan
 */
export async function updateWithdrawalAccount(id, payload) {
  const token = getUserToken()
  if (!token) throw new Error('Harap masuk terlebih dahulu')

  const response = await fetch(`${API_BASE}/wallet/accounts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error?.message || 'Gagal memperbarui rekening penarikan')
  }

  return data
}

/**
 * Menghapus rekening penarikan
 */
export async function deleteWithdrawalAccount(id) {
  const token = getUserToken()
  if (!token) throw new Error('Harap masuk terlebih dahulu')

  const response = await fetch(`${API_BASE}/wallet/accounts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error?.message || 'Gagal menghapus rekening penarikan')
  }

  return data
}
