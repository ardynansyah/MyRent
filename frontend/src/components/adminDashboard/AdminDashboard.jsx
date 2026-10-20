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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-row items-stretch">
      <AdminSidebar
        activeKey="verifikasi"
        counts={{ verifikasi: jumlahAntrean, mediasi: 2 }}
        onLogout={handleLogout}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header mobile (sidebar disembunyikan di layar kecil) */}
        <header className="lg:hidden flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[15px] font-extrabold text-blue-600 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            SewaAlat
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-700 cursor-pointer"
          >
            Keluar Sesi
          </button>
        </header>

        <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Portal Admin</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-900">Verifikasi akun</span>
          </div>

          {/* Judul + pencarian */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-[28px] font-extrabold tracking-[-0.6px] leading-tight text-slate-900">
                Verifikasi Akun
              </h1>
              <p className="text-sm text-slate-500">
                {jumlahAntrean} pengajuan menunggu tinjauan · rata-rata respons 1 × 24 jam kerja
              </p>
            </div>

            <div className="relative w-full lg:w-[320px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari nama, ID, atau email..."
                className="w-full h-11 pl-11 pr-4 rounded-[10px] bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {/* Tab filter */}
          <div className="flex flex-wrap items-center gap-1 p-1 w-fit bg-white rounded-xl border border-slate-200">
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
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  <span className={`ml-2 tabular-nums ${isActive ? 'text-blue-300' : 'text-slate-500'}`}>
                    {jumlah}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Tabel pengajuan */}
          <div className="w-full bg-white rounded-[14px] border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-slate-50 text-slate-500">
                  <tr className="text-xs font-bold tracking-wider uppercase">
                    <th className="py-3 px-6">Pengajuan</th>
                    <th className="py-3 px-6">Pemohon</th>
                    <th className="py-3 px-6">Lokasi</th>
                    <th className="py-3 px-6 hidden xl:table-cell">Kelengkapan</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {daftarTersaring.map((row) => {
                    const status = STATUS_META[row.status]

                    return (
                      <tr key={row.id} className="hover:bg-[#FAFBFC] transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-mono font-bold tabular-nums text-slate-900">{row.id}</span>
                            <span className="text-xs text-slate-500 tabular-nums">Diajukan {row.diajukan}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-base font-bold text-slate-900 truncate">
                              {row.nama}
                            </span>
                            <span className="text-xs text-slate-500 truncate">{row.tipe}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1 max-w-[220px]">
                            <span className="text-sm text-slate-600 truncate">{row.lokasi}</span>
                            <span className="text-xs text-slate-500 truncate">{row.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden xl:table-cell">
                          <span className="text-sm text-slate-600">{row.langkah}</span>
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
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[9px] border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600 transition-colors cursor-pointer"
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
                <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center">
                  <Inbox className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  Tidak ada pengajuan pada tab ini
                </p>
                <p className="text-xs text-slate-400">
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
