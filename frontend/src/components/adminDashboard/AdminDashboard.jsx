import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronRight, Inbox, ArrowLeft } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import { logoutAdmin } from '../adminAuth/adminSession'
import {
  DAFTAR_PENGAJUAN,
  STATUS_MENUNGGU,
  STATUS_META,
  TAB_PENGAJUAN
} from './adminDashboardData'

/**
 * Dashboard Admin HQ — tabel daftar pengajuan (tab Semua / Menunggu / Perlu
 * perbaikan / Disetujui / Ditolak).
 * Konversi dari bagian navigasi "Verifikasi Akun" pada
 * `frontend/assetAdmin/AdminPanel-export.html`.
 *
 * @param {function} props.onLogout - callback logout opsional (bila tidak provided dipakai default)
 */
export default function AdminDashboard({ onLogout }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('SEMUA')
  const [keyword, setKeyword] = useState('')

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
      return
    }
    logoutAdmin(navigate)
  }

  const daftarTersaring = useMemo(() => {
    const lowered = keyword.trim().toLowerCase()

    return DAFTAR_PENGAJUAN.filter((item) => {
      const cocokTab = tab === 'SEMUA' || item.status === tab
      const cocokKata =
        !lowered ||
        item.nama.toLowerCase().includes(lowered) ||
        item.id.toLowerCase().includes(lowered) ||
        item.email.toLowerCase().includes(lowered) ||
        item.lokasi.toLowerCase().includes(lowered)

      return cocokTab && cocokKata
    })
  }, [tab, keyword])

  const jumlahAntrean = DAFTAR_PENGAJUAN.filter((item) => item.status === STATUS_MENUNGGU).length

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
            className="flex items-center gap-2 text-[15px] font-extrabold text-[#2563EB] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            SewaAlat
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

            <div className="relative w-full lg:w-[320px]">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari nama, ID, atau email..."
                className="w-full h-11 pl-11 pr-4 rounded-[10px] bg-white border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] transition-all"
              />
            </div>
          </div>

          {/* Tab filter */}
          <div className="flex flex-wrap items-center gap-1 p-1 w-fit bg-white rounded-[12px] border border-[#E2E8F0]">
            {TAB_PENGAJUAN.map((item) => {
              const isActive = tab === item.key
              const jumlah =
                item.key === 'SEMUA'
                  ? DAFTAR_PENGAJUAN.length
                  : DAFTAR_PENGAJUAN.filter((row) => row.status === item.key).length

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

          {/* Tabel pengajuan */}
          <div className="w-full bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden">
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
                  {daftarTersaring.map((row) => {
                    const status = STATUS_META[row.status]

                    return (
                      <tr key={row.id} className="hover:bg-[#FAFBFC] transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-[#0F172A]">{row.id}</span>
                            <span className="text-xs text-[#94A3B8]">Diajukan {row.diajukan}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-base font-bold text-[#0F172A] truncate">
                              {row.nama}
                            </span>
                            <span className="text-xs text-[#64748B] truncate">{row.tipe}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1 max-w-[220px]">
                            <span className="text-sm text-[#475569] truncate">{row.lokasi}</span>
                            <span className="text-xs text-[#94A3B8] truncate">{row.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden xl:table-cell">
                          <span className="text-sm text-[#475569]">{row.langkah}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap ${status.chip}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/portal-internal-hq/dashboard/pengajuan/${row.id}`)
                            }
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[9px] border border-[#E2E8F0] bg-white text-sm font-semibold text-[#475569] hover:border-[#BFDBFE] hover:text-[#2563EB] transition-colors cursor-pointer"
                          >
                            <span>Tinjau</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {daftarTersaring.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-14 text-center">
                <div className="w-11 h-11 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                  <Inbox className="w-5 h-5 text-[#94A3B8]" />
                </div>
                <p className="text-sm font-semibold text-[#475569]">
                  Tidak ada pengajuan pada tab ini
                </p>
                <p className="text-xs text-[#94A3B8]">
                  Ubah kata kunci pencarian atau pilih tab lain.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
