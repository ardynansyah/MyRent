/**
 * Client HTTP untuk endpoint pesanan (MyRent API).
 *
 * Semua request menyertakan token JWT dari localStorage agar
 * backend bisa mengidentifikasi user yang sedang login.
 */

import { API_BASE } from './equipmentsApi'
import { getUserToken } from './userSession'

function authHeaders() {
  const token = getUserToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * Ambil seluruh pesanan milik user yang login.
 */
export async function listOrders() {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: { ...authHeaders() }
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error?.message || 'Gagal memuat pesanan')
  return body?.data ?? []
}

/**
 * Ambil detail pesanan berdasarkan id atau invoiceNumber.
 */
export async function getOrder(id) {
  const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, {
    headers: { ...authHeaders() }
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error?.message || 'Gagal memuat detail pesanan')
  return body?.data
}

/**
 * Buat pesanan baru.
 */
export async function createOrder(data) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data)
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error?.message || 'Gagal membuat pesanan')
  return body?.data
}

/**
 * Batalkan pesanan.
 */
export async function cancelOrder(id) {
  const res = await fetch(`${API_BASE}/orders/${id}/cancel`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() }
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error?.message || 'Gagal membatalkan pesanan')
  return body?.data
}

/**
 * Konfirmasi terima barang (DIKIRIM → SEWA_AKTIF).
 */
export async function confirmDelivery(id) {
  const res = await fetch(`${API_BASE}/orders/${id}/confirm-delivery`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() }
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error?.message || 'Gagal mengonfirmasi penerimaan')
  return body?.data
}

/**
 * Perpanjang masa sewa.
 */
export async function extendOrder(id, additionalDays) {
  const res = await fetch(`${API_BASE}/orders/${id}/extend`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ additionalDays })
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error?.message || 'Gagal memperpanjang sewa')
  return body
}

/**
 * Simpan draf pengembalian (tanpa ubah status).
 */
export async function saveReturnDraft(id, returnData) {
  const res = await fetch(`${API_BASE}/orders/${id}/return-draft`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ returnData })
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error?.message || 'Gagal menyimpan draf pengembalian')
  return body?.data
}

/**
 * Submit BAST Akhir (SEWA_AKTIF → INSPEKSI).
 */
export async function submitReturn(id, returnData) {
  const res = await fetch(`${API_BASE}/orders/${id}/return-submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ returnData })
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error?.message || 'Gagal mengirim BAST Akhir')
  return body?.data
}
