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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-row items-stretch">
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
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700/60 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-300 max-w-[90vw]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-300" />
            <span>{toast}</span>
          </div>
        ) : null}

        {/* Header mobile */}
        <header className="lg:hidden flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => navigate('/portal-internal-hq/dashboard')}
            className="flex items-center gap-2 text-[13px] font-extrabold text-[#2563EB] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Verifikasi akun
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
          {/* Breadcrumb + navigasi pengajuan */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/portal-internal-hq/dashboard')}
                aria-label="Kembali ke daftar pengajuan"
                className="w-9 h-9 shrink-0 rounded-[9px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-[#94A3B8]">Verifikasi akun</span>
              <span className="text-xs text-[#94A3B8]">/</span>
              <span className="text-xs font-semibold text-[#0F172A]">
                Pengajuan #{pengajuan.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#94A3B8]">
                Pengajuan {posisi + 1} dari {DAFTAR_PENGAJUAN.length}
              </span>
              <button
                type="button"
                disabled={!navigasiSebelumnya}
                onClick={() =>
                  navigate(`/portal-internal-hq/dashboard/pengajuan/${navigasiSebelumnya.id}`)
                }
                aria-label="Pengajuan sebelumnya"
                className="w-9 h-9 rounded-[9px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                className="w-9 h-9 rounded-[9px] bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Header pemohon — tanpa avatar inisial, hanya satu badge status */}
          <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-[14px] bg-white border border-[#E2E8F0]">
            <div className="flex flex-col gap-3 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold tracking-[-0.5px] text-[#0F172A]">
                  {pengajuan.nama}
                </h1>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusMeta.chip}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                  {statusMeta.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#475569]">
                <span className="inline-flex items-center gap-2">
                  <Store className="w-4 h-4 shrink-0 text-[#94A3B8]" />
                  {pengajuan.tipe}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0 text-[#94A3B8]" />
                  {pengajuan.email}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0 text-[#94A3B8]" />
                  {pengajuan.lokasi}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0 text-[#94A3B8]" />
                  Diajukan {pengajuan.diajukan}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setModalPerbaikan(true)}
                className="flex items-center gap-2 px-4 h-10 rounded-[10px] bg-white border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <PencilLine className="w-4 h-4" />
                <span>Minta perbaikan</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTolak(true)}
                className="flex items-center gap-2 px-4 h-10 rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] text-sm font-bold text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Tolak</span>
              </button>
              <button
                type="button"
                onClick={handleSetujui}
                className="flex items-center gap-2 px-4 h-10 rounded-[10px] bg-[#15803D] text-sm font-bold text-white hover:bg-[#166534] transition-colors cursor-pointer"
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
                    className="w-full flex flex-col gap-6 p-6 rounded-[14px] bg-white border border-[#E2E8F0]"
                  >
                    <div className="w-full flex items-center gap-3">
                      <div className="w-8 h-8 shrink-0 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                        <Check className="w-4 h-4 text-[#15803D]" strokeWidth={2.6} />
                      </div>
                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <span className="text-base font-bold text-[#0F172A]">
                          Step {step.nomor} · {step.judul}
                        </span>
                        <span className="text-xs text-[#94A3B8]">{step.sub}</span>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-semibold ${
                          step.tone === 'info' ? 'text-[#1D4ED8]' : 'text-[#15803D]'
                        }`}
                      >
                        {step.badge}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleStep(index)}
                        aria-label={terbuka ? 'Sembunyikan langkah' : 'Tampilkan langkah'}
                        className="w-4 h-4 shrink-0 text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer"
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
                            {step.fields.map((field) => (
                              <div key={field.label} className="flex flex-col gap-1.5">
                                <span className="text-sm text-[#64748B]">{field.label}</span>
                                <span className="text-base font-medium text-[#0F172A]">
                                  {field.value}
                                </span>
                              </div>
                            ))}
                          </div>

                          {step.daya ? (
                            <div className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] bg-[#F8FAFC]">
                              <Zap className="w-4 h-4 shrink-0 text-[#B45309]" />
                              <span className="text-sm text-[#64748B]">
                                Daya listrik tempat usaha
                              </span>
                              <span className="flex-1 h-px bg-[#E2E8F0]" />
                              <span className="text-sm font-semibold text-[#0F172A]">
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
                                className="flex-1 flex items-center gap-3 p-3 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] text-left hover:border-[#BFDBFE] transition-colors cursor-pointer"
                              >
                                <div className="w-9 h-9 shrink-0 rounded-[8px] bg-[#EFF6FF] flex items-center justify-center">
                                  <ImageIcon className="w-4 h-4 text-[#2563EB]" />
                                </div>
                                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                                  <span className="text-sm font-semibold text-[#0F172A] truncate">
                                    {doc.nama}
                                  </span>
                                  <span className="text-xs text-[#94A3B8] truncate">{doc.meta}</span>
                                </div>
                                <Maximize2 className="w-4 h-4 shrink-0 text-[#94A3B8]" />
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
              <section className="w-full flex flex-col gap-4 p-5 rounded-[14px] bg-white border border-[#E2E8F0]">
                <div className="w-full flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#0F172A]">Checklist verifikasi</span>
                  <span className="text-sm font-semibold text-[#2563EB]">
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
                          className="peer absolute inset-0 w-full h-full m-0 appearance-none rounded-[6px] border-[1.5px] border-[#CBD5E1] bg-white checked:bg-[#2563EB] checked:border-[#2563EB] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40"
                        />
                        <Check className="pointer-events-none absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                      </span>
                      <span
                        className={`flex-1 text-sm leading-6 ${
                          checklist[index] ? 'text-[#64748B]' : 'text-[#0F172A]'
                        }`}
                      >
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Catatan internal */}
              <section className="w-full flex flex-col gap-3 p-5 rounded-[14px] bg-white border border-[#E2E8F0]">
                <span className="text-sm font-bold text-[#0F172A]">Catatan internal</span>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  rows={4}
                  className="w-full min-h-[96px] p-3 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] text-sm leading-6 text-[#475569] resize-none focus:outline-none focus:border-[#2563EB] transition-colors"
                />
                <div className="w-full flex items-center justify-between gap-2">
                  <span className="text-xs text-[#94A3B8]">Hanya terlihat admin</span>
                  <button
                    type="button"
                    onClick={() => showToast('Catatan internal tersimpan.')}
                    className="text-sm font-semibold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>
              </section>

              {/* Riwayat pengajuan */}
              <section className="w-full flex flex-col gap-4 p-5 rounded-[14px] bg-white border border-[#E2E8F0]">
                <span className="text-sm font-bold text-[#0F172A]">Riwayat pengajuan</span>
                <div className="w-full flex flex-col gap-3">
                  {RIWAYAT_PENGAJUAN.map((item) => (
                    <div key={item.judul} className="w-full flex items-start gap-3">
                      <span
                        className={`w-2 h-2 mt-2 shrink-0 rounded-full ${
                          item.aktif ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                        }`}
                      />
                      <div className="flex-1 flex flex-col gap-0.5">
                        <span className="text-sm text-[#0F172A]">{item.judul}</span>
                        <span className="text-xs text-[#94A3B8]">{item.waktu}</span>
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
