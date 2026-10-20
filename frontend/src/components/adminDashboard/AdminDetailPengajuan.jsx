import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Check,
  X,
  PencilLine,
  Mail,
  MapPin,
  Clock,
  Image as ImageIcon,
  Maximize2,
  Zap,
  Store,
  CheckCircle2
} from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import ModalTolakPengajuan from './ModalTolakPengajuan'
import ModalMintaPerbaikan from './ModalMintaPerbaikan'
import { logoutAdmin } from '../adminAuth/adminSession'
import {
  CATATAN_INTERNAL,
  CHECKLIST_VERIFIKASI,
  DAFTAR_PENGAJUAN,
  LANGKAH_PENGAJUAN,
  PENGAJUAN_AKTIF,
  RIWAYAT_PENGAJUAN,
  STATUS_DISETUJUI,
  STATUS_DITOLAK,
  STATUS_MENUNGGU,
  STATUS_META,
  STATUS_PERLU_PERBAIKAN,
  setStatusPengajuan
} from './adminDashboardData'

/**
 * Halaman detail pengajuan admin HQ.
 * Konversi dari `frontend/assetAdmin/AdminPanel-export.html`.
 *
 * PENTING: alur registrasi MyRent memakai 5 step
 * (1. Identitas & KTP, 2. Profil & Daya Listrik, 3. Gudang/Lokasi Operasional,
 * 4. Alamat & Rekening, 5. Review). Versi HTML export hanya berisi 3 step,
 * karena itu step 3 & 5 dirender memakai data dummy sampai endpoint
 * detail pengajuan tersedia di backend.
 *
 * @param {function} props.onLogout - callback logout opsional
 */
export default function AdminDetailPengajuan({ onLogout }) {
  const navigate = useNavigate()
  const params = useParams()

  const [modalPerbaikan, setModalPerbaikan] = useState(false)
  const [modalTolak, setModalTolak] = useState(false)
  const [catatan, setCatatan] = useState(CATATAN_INTERNAL)
  const [toast, setToast] = useState('')
  const [stepTerbuka, setStepTerbuka] = useState(() =>
    LANGKAH_PENGAJUAN.map(() => true)
  )
  const [statusLokal, setStatusLokal] = useState(null)
  const [checklist, setChecklist] = useState(() =>
    CHECKLIST_VERIFIKASI.map((item) => item.checked)
  )

  const pengajuan = useMemo(() => {
    const list = DAFTAR_PENGAJUAN
    const index = list.findIndex((item) => item.id === params.id)
    // ID yang tidak dikenal tetap displaying pengajuan pertama supaya halaman tidak kosong.
    return index === -1 ? { ...PENGAJUAN_AKTIF, ...(list[0] || {}) } : list[index]
  }, [params.id])

  // Reset state lokal saat admin berpindah ke pengajuan lain.
  const [idTerpantau, setIdTerpantau] = useState(params.id)
  if (params.id !== idTerpantau) {
    setIdTerpantau(params.id)
    setStatusLokal(null)
    setChecklist(CHECKLIST_VERIFIKASI.map((item) => item.checked))
  }

  const posisi = DAFTAR_PENGAJUAN.findIndex((item) => item.id === pengajuan.id)
  const navigasiSebelumnya = posisi > 0 ? DAFTAR_PENGAJUAN[posisi - 1] : null
  const navigasiBerikutnya =
    posisi > -1 && posisi < DAFTAR_PENGAJUAN.length - 1 ? DAFTAR_PENGAJUAN[posisi + 1] : null
  const statusAktif = statusLokal ?? pengajuan.status
  const statusMeta = STATUS_META[statusAktif] || STATUS_META[STATUS_MENUNGGU]

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
      return
    }
    logoutAdmin(navigate)
  }

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(''), 3500)
  }

  const handleSetujui = () => {
    setStatusLokal(STATUS_DISETUJUI)
    setStatusPengajuan(pengajuan.id, STATUS_DISETUJUI)
    showToast(`Akun ${pengajuan.nama} disetujui dan notifikasi telah dikirim.`)
  }

  const handleMintaPerbaikan = (payload) => {
    setStatusLokal(STATUS_PERLU_PERBAIKAN)
    setStatusPengajuan(pengajuan.id, STATUS_PERLU_PERBAIKAN)
    const daftarStep = payload.steps.map((nomor) => `Step ${nomor}`).join(', ')
    showToast(`Permintaan perbaikan dikirim ke pengaju untuk ${daftarStep}.`)
  }

  const handleTolak = (payload) => {
    setStatusLokal(STATUS_DITOLAK)
    setStatusPengajuan(pengajuan.id, STATUS_DITOLAK)
    showToast(`Pengajuan ditolak permanen · ${payload.alasan}.`)
  }

  const toggleStep = (index) => {
    setStepTerbuka((prev) => prev.map((open, i) => (i === index ? !open : open)))
  }

  const toggleChecklist = (index) => {
    setChecklist((prev) => prev.map((checked, i) => (i === index ? !checked : checked)))
  }

  const checklistSelesai = checklist.filter(Boolean).length

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-row items-stretch">
      <AdminSidebar
        activeKey="verifikasi"
        counts={{
          verifikasi: DAFTAR_PENGAJUAN.filter((item) => item.status === STATUS_MENUNGGU).length,
          mediasi: 2
        }}
        onLogout={handleLogout}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Toast */}
        {toast ? (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700/60 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-300 max-w-[90vw]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-300" />
            <span>{toast}</span>
          </div>
        ) : null}

        {/* Header mobile */}
        <header className="lg:hidden flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/portal-internal-hq/dashboard')}
            className="flex items-center gap-2 text-[13px] font-extrabold text-blue-600 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Verifikasi akun
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
          {/* Breadcrumb + navigasi pengajuan */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/portal-internal-hq/dashboard')}
                aria-label="Kembali ke daftar pengajuan"
                className="w-9 h-9 shrink-0 rounded-[9px] bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-400">Verifikasi akun</span>
              <span className="text-xs text-slate-400">/</span>
              <span className="text-xs font-semibold text-slate-900">
                Pengajuan #{pengajuan.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                Pengajuan {posisi + 1} dari {DAFTAR_PENGAJUAN.length}
              </span>
              <button
                type="button"
                disabled={!navigasiSebelumnya}
                onClick={() =>
                  navigate(`/portal-internal-hq/dashboard/pengajuan/${navigasiSebelumnya.id}`)
                }
                aria-label="Pengajuan sebelumnya"
                className="w-9 h-9 rounded-[9px] bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={!navigasiBerikutnya}
                onClick={() =>
                  navigate(`/portal-internal-hq/dashboard/pengajuan/${navigasiBerikutnya.id}`)
                }
                aria-label="Pengajuan berikutnya"
                className="w-9 h-9 rounded-[9px] bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Header pemohon — tanpa avatar inisial, hanya satu badge status */}
          <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-[14px] bg-white border border-slate-200">
            <div className="flex flex-col gap-3 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold tracking-[-0.5px] text-slate-900">
                  {pengajuan.nama}
                </h1>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusMeta.chip}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                  {statusMeta.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Store className="w-4 h-4 shrink-0 text-slate-400" />
                  {pengajuan.tipe}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                  {pengajuan.email}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                  {pengajuan.lokasi}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0 text-slate-400" />
                  Diajukan {pengajuan.diajukan}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setModalPerbaikan(true)}
                className="flex items-center gap-2 px-4 h-10 rounded-[10px] bg-white border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <PencilLine className="w-4 h-4" />
                <span>Minta perbaikan</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTolak(true)}
                className="flex items-center gap-2 px-4 h-10 rounded-[10px] bg-red-50 border border-red-200 text-sm font-bold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Tolak</span>
              </button>
              <button
                type="button"
                onClick={handleSetujui}
                className="flex items-center gap-2 px-4 h-10 rounded-[10px] bg-green-700 text-sm font-bold text-white hover:bg-green-800 transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Setujui akun</span>
              </button>
            </div>
          </div>

          {/* Dua kolom: data step + panel samping */}
          <div className="w-full flex flex-col xl:flex-row gap-6 items-start">
            {/* Kolom data 5 step registrasi */}
            <div className="flex-1 w-full min-w-0 flex flex-col gap-5">
              {LANGKAH_PENGAJUAN.map((step, index) => {
                const terbuka = stepTerbuka[index]

                return (
                  <section
                    key={step.nomor}
                    className="w-full flex flex-col gap-6 p-6 rounded-[14px] bg-white border border-slate-200"
                  >
                    <div className="w-full flex items-center gap-3">
                      <div className="w-8 h-8 shrink-0 rounded-full bg-green-50 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-700" strokeWidth={2.6} />
                      </div>
                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <span className="text-base font-bold text-slate-900">
                          Step {step.nomor} · {step.judul}
                        </span>
                        <span className="text-xs text-slate-400">{step.sub}</span>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-semibold ${
                          step.tone === 'info' ? 'text-blue-700' : 'text-green-700'
                        }`}
                      >
                        {step.badge}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleStep(index)}
                        aria-label={terbuka ? 'Sembunyikan langkah' : 'Tampilkan langkah'}
                        className="w-4 h-4 shrink-0 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        <ChevronUp
                          className={`w-4 h-4 transition-transform ${terbuka ? '' : 'rotate-180'}`}
                        />
                      </button>
                    </div>

                    {terbuka ? (
                      <>
                        <div className="w-full flex flex-col gap-6">
                          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                            {step.fields.map((field) => {
                              const isNumericField =
                                ['NIK', 'NIB', 'Bank & No. Rekening', 'Tahun Berdiri', 'Kota / Kode Pos'].includes(field.label) ||
                                /\d{4,}/.test(field.value)

                              return (
                                <div key={field.label} className="flex flex-col gap-1.5">
                                  <span className="text-sm text-slate-500">{field.label}</span>
                                  <span
                                    className={`text-base font-medium text-slate-900 ${
                                      isNumericField ? 'font-mono tabular-nums' : ''
                                    }`}
                                  >
                                    {field.value}
                                  </span>
                                </div>
                              )
                            })}
                          </div>

                          {step.daya ? (
                            <div className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] bg-slate-50">
                              <Zap className="w-4 h-4 shrink-0 text-amber-700" />
                              <span className="text-sm text-slate-500">
                                Daya listrik tempat usaha
                              </span>
                              <span className="flex-1 h-px bg-slate-200" />
                              <span className="text-sm font-semibold tabular-nums text-slate-900">
                                {step.daya}
                              </span>
                            </div>
                          ) : null}
                        </div>

                        {step.dokumen?.length ? (
                          <div className="w-full flex flex-col sm:flex-row gap-3">
                            {step.dokumen.map((doc) => (
                              <button
                                key={doc.nama}
                                type="button"
                                className="flex-1 flex items-center gap-3 p-3 rounded-[10px] bg-slate-50 border border-slate-200 text-left hover:border-blue-200 transition-colors cursor-pointer"
                              >
                                <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
                                  <ImageIcon className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                                  <span className="text-sm font-semibold text-slate-900 truncate">
                                    {doc.nama}
                                  </span>
                                  <span className="text-xs text-slate-400 truncate">{doc.meta}</span>
                                </div>
                                <Maximize2 className="w-4 h-4 shrink-0 text-slate-400" />
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </section>
                )
              })}
            </div>

            {/* Panel samping: checklist, catatan internal, riwayat */}
            <aside className="w-full xl:w-[320px] shrink-0 flex flex-col gap-5">
              {/* Checklist verifikasi */}
              <section className="w-full flex flex-col gap-4 p-5 rounded-[14px] bg-white border border-slate-200">
                <div className="w-full flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900">Checklist verifikasi</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {checklistSelesai} / {CHECKLIST_VERIFIKASI.length}
                  </span>
                </div>
                <div className="w-full flex flex-col gap-3">
                  {CHECKLIST_VERIFIKASI.map((item, index) => (
                    <label key={item.label} className="w-full flex items-start gap-3 cursor-pointer">
                      <span className="relative w-5 h-5 shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={checklist[index]}
                          onChange={() => toggleChecklist(index)}
                          className="peer absolute inset-0 w-full h-full m-0 appearance-none rounded-md border-[1.5px] border-slate-300 bg-white checked:bg-blue-600 checked:border-blue-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
                        />
                        <Check className="pointer-events-none absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                      </span>
                      <span
                        className={`flex-1 text-sm leading-6 ${
                          checklist[index] ? 'text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Catatan internal */}
              <section className="w-full flex flex-col gap-3 p-5 rounded-[14px] bg-white border border-slate-200">
                <span className="text-sm font-bold text-slate-900">Catatan internal</span>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  rows={4}
                  className="w-full min-h-24 p-3 rounded-[10px] bg-slate-50 border border-slate-200 text-sm leading-6 text-slate-600 resize-none focus:outline-none focus:border-blue-600 transition-colors"
                />
                <div className="w-full flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400">Hanya terlihat admin</span>
                  <button
                    type="button"
                    onClick={() => showToast('Catatan internal tersimpan.')}
                    className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>
              </section>

              {/* Riwayat pengajuan */}
              <section className="w-full flex flex-col gap-4 p-5 rounded-[14px] bg-white border border-slate-200">
                <span className="text-sm font-bold text-slate-900">Riwayat pengajuan</span>
                <div className="w-full flex flex-col gap-3">
                  {RIWAYAT_PENGAJUAN.map((item) => (
                    <div key={item.judul} className="w-full flex items-start gap-3">
                      <span
                        className={`w-2 h-2 mt-2 shrink-0 rounded-full ${
                          item.aktif ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      />
                      <div className="flex-1 flex flex-col gap-0.5">
                        <span className="text-sm text-slate-900">{item.judul}</span>
                        <span className="text-xs text-slate-400">{item.waktu}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>

      {/* Alur 1 — minta perbaikan (revisi, pengaju masih bisa memperbaiki) */}
      <ModalMintaPerbaikan
        isOpen={modalPerbaikan}
        onClose={() => setModalPerbaikan(false)}
        onSubmit={handleMintaPerbaikan}
        idPengajuan={pengajuan.id}
        namaPengajuan={pengajuan.nama}
        tipePengajuan={pengajuan.tipe}
      />

      {/* Alur 2 — tolak permanen (tanpa opsi perbaikan) */}
      <ModalTolakPengajuan
        isOpen={modalTolak}
        onClose={() => setModalTolak(false)}
        onSubmit={handleTolak}
        idPengajuan={pengajuan.id}
        namaPengajuan={pengajuan.nama}
        tipePengajuan={pengajuan.tipe}
      />
    </div>
  )
}
