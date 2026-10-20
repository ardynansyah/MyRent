import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronRight, Inbox, ArrowLeft, Layers, RefreshCw, AlertCircle } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import StatusBadge from './StatusBadge'
import { logoutAdmin } from '../adminAuth/adminSession'
import { fetchSubmissions } from './adminApi'
import { formatRelativeTime } from '../../lib/registration'
import {
  STATUS_MENUNGGU,
  TAB_PENGAJUAN
} from './adminDashboardData'

/**
 * Dashboard Admin HQ — tabel daftar pengajuan (tab Semua / Menunggu / Perlu
 * perbaikan / Disetujui / Ditolak).
 *
 * Data diambil langsung dari MySQL melalui `GET /api/admin/submissions`
 * (JWT admin), bukan data dummy.
 *
 * @param {function} props.onLogout - callback logout opsional (bila tidak provided dipakai default)
 */
export default function AdminDashboard({ onLogout }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('SEMUA')
  const [keyword, setKeyword] = useState('')
  const [pengajuan, setPengajuan] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
      return
    }
    logoutAdmin(navigate)
  }

  const loadPengajuan = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await fetchSubmissions()
      setPengajuan(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar pengajuan.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPengajuan()
  }, [loadPengajuan])

  const daftarTersaring = useMemo(() => {
    const lowered = keyword.trim().toLowerCase()

    return pengajuan.filter((item) => {
      const cocokTab = tab === 'SEMUA' || item.verificationStatus === tab
      const haystack = [
        item.nama,
        item.submissionCode,
        item.email,
        item.lokasi,
        item.fullName,
        item.tipe
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const cocokKata = !lowered || haystack.includes(lowered)

      return cocokTab && cocokKata
    })
  }, [pengajuan, tab, keyword])

  const jumlahAntrean = pengajuan.filter((item) => item.verificationStatus === STATUS_MENUNGGU).length

  const jumlahPerTab = (key) =>
    key === 'SEMUA' ? pengajuan.length : pengajuan.filter((row) => row.verificationStatus === key).length

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-row items-stretch">
      <AdminSidebar
        activeKey="verifikasi"
        counts={{ verifikasi: jumlahAntrean, mediasi: 2 }}
        onLogout={handleLogout}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header mobile (sidebar disembunyikan di layar kecil) */}
        <header className="lg:hidden flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[15px] font-extrabold text-foreground cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <Layers className="size-5 text-primary" />
            MyRent HQ
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-3 py-1.5 text-[11px] font-bold text-[#B91C1C] cursor-pointer"
          >
            Keluar Sesi
          </button>
        </header>

        <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#94A3B8]">Portal Admin</span>
            <span className="text-xs text-[#94A3B8]">/</span>
            <span className="text-xs font-semibold text-[#0F172A]">Verifikasi akun</span>
          </div>

          {/* Judul + pencarian */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-[28px] font-extrabold tracking-[-0.6px] leading-tight text-[#0F172A]">
                Verifikasi Akun
              </h1>
              <p className="text-sm text-[#64748B]">
                {jumlahAntrean} pengajuan menunggu tinjauan · rata-rata respons 1 × 24 jam kerja
              </p>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-[380px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Cari nama, kode, atau email..."
                  className="w-full h-11 pl-11 pr-4 rounded-[10px] bg-white border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] transition-all"
                />
              </div>
              <button
                type="button"
                onClick={loadPengajuan}
                disabled={isLoading}
                title="Muat ulang data"
                className="shrink-0 h-11 w-11 rounded-[10px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#2563EB] hover:border-[#BFDBFE] transition-colors cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Tab filter */}
          <div className="flex flex-wrap items-center gap-1 p-1 w-fit bg-white rounded-[12px] border border-[#E2E8F0]">
            {TAB_PENGAJUAN.map((item) => {
              const isActive = tab === item.key
              const jumlah = jumlahPerTab(item.key)

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key)}
                  className={`px-4 py-2 rounded-[9px] text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0F172A] text-white'
                      : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                  }`}
                >
                  {item.label}
                  <span className={`ml-2 ${isActive ? 'text-[#93C5FD]' : 'text-[#94A3B8]'}`}>
                    {jumlah}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Pesan error */}
          {error ? (
            <div className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                type="button"
                onClick={loadPengajuan}
                className="text-sm font-semibold underline cursor-pointer"
              >
                Coba lagi
              </button>
            </div>
          ) : null}

          {/* Tabel pengajuan */}
          <div className="w-full bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <RefreshCw className="w-5 h-5 text-[#2563EB] animate-spin" />
                <p className="text-sm font-semibold text-[#475569]">Memuat daftar pengajuan...</p>
                <p className="text-xs text-[#94A3B8]">Mengambil data dari server verifikasi MyRent.</p>
              </div>
            ) : (
              <>
                {daftarTersaring.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left">
                      <thead className="bg-[#F8FAFC] text-[#64748B]">
                        <tr className="text-xs font-bold tracking-[0.4px] uppercase">
                          <th className="py-3 px-6">Pengajuan</th>
                          <th className="py-3 px-6">Pemohon</th>
                          <th className="py-3 px-6">Lokasi</th>
                          <th className="py-3 px-6 hidden xl:table-cell">Kelengkapan</th>
                          <th className="py-3 px-6">Status</th>
                          <th className="py-3 px-6 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {daftarTersaring.map((row) => (
                          <tr key={row.id} className="hover:bg-[#FAFBFC] transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-[#0F172A]">
                                  {row.submissionCode || row.id}
                                </span>
                                <span className="text-xs text-[#94A3B8]">
                                  Diajukan {formatRelativeTime(row.createdAt)}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex min-w-0 flex-col gap-1">
                                <span className="truncate text-base font-bold text-[#0F172A]">
                                  {row.nama || row.fullName}
                                </span>
                                <span className="truncate text-xs text-[#64748B]">{row.tipe}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex max-w-[220px] flex-col gap-1">
                                <span className="truncate text-sm text-[#475569]">{row.lokasi}</span>
                                <span className="truncate text-xs text-[#94A3B8]">{row.email}</span>
                              </div>
                            </td>
                            <td className="hidden py-4 px-6 xl:table-cell">
                              <span className="text-sm text-[#475569]">{row.langkah}</span>
                            </td>
                            <td className="py-4 px-6">
                              <StatusBadge status={row.verificationStatus} />
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/portal-internal-hq/dashboard/pengajuan/${row.submissionCode || row.id}`
                                  )
                                }
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-[9px] border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#475569] transition-colors hover:border-[#BFDBFE] hover:text-[#2563EB]"
                              >
                                <span>Tinjau</span>
                                <ChevronRight className="size-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}

                {daftarTersaring.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-14 text-center">
                    <div className="w-11 h-11 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                      <Inbox className="w-5 h-5 text-[#94A3B8]" />
                    </div>
                    <p className="text-sm font-semibold text-[#475569]">
                      {pengajuan.length === 0
                        ? 'Belum ada pengajuan masuk'
                        : 'Tidak ada pengajuan pada tab ini'}
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      {pengajuan.length === 0
                        ? 'Pengajuan dari Penyewa UMKM dan Pemilik Alat akan muncul di sini setelah dikirim.'
                        : 'Ubah kata kunci pencarian atau pilih tab lain.'}
                    </p>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
