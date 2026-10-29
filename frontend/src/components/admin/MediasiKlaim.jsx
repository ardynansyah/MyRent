import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Scale,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Search,
  RefreshCw,
  Store,
  User,
  Image as ImageIcon,
  Check,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  MessageSquare,
  Calculator,
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import { listOrders, resolveDispute } from '../../lib/ordersApi'
import { formatLongDate, formatShortDate } from '../../lib/dateHelpers'

export default function MediasiKlaim() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [activeTab, setActiveTab] = useState('AKTIF') // 'AKTIF' | 'SELESAI'
  const [searchQuery, setSearchQuery] = useState('')

  // Form Putusan Admin State
  const [finalDamageFee, setFinalDamageFee] = useState(0)
  const [adminResolutionNote, setAdminResolutionNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const formatRupiah = (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`

  const showNotification = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 4000)
  }

  // Load seluruh pesanan sengketa & riwayat
  const loadOrders = useCallback(async () => {
    setIsLoading(true)
    setErrorMsg('')
    try {
      const data = await listOrders({ all: 'true' })
      const allOrders = Array.isArray(data) ? data : []
      setOrders(allOrders)

      // Auto-pilih sengketa aktif pertama jika ada
      const firstDispute = allOrders.find((o) => o.status === 'DISPUTE')
      if (firstDispute) {
        setSelectedOrderId(firstDispute.id)
        setFinalDamageFee(firstDispute.damageFee || Math.round((firstDispute.depositAmount || 0) * 0.5))
        setAdminResolutionNote('Berdasarkan komparasi BAST awal dan bukti kondisi pengembalian, tuntutan ganti rugi disesuaikan secara proporsional.')
      } else if (allOrders.length > 0) {
        setSelectedOrderId(allOrders[0].id)
      }
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memuat daftar pesanan mediasi.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Pisahkan sengketa aktif vs riwayat selesai
  const activeDisputes = useMemo(() => {
    return orders.filter((o) => o.status === 'DISPUTE')
  }, [orders])

  const resolvedDisputes = useMemo(() => {
    return orders.filter(
      (o) => o.status === 'SELESAI' && (o.isResolvedByAdmin || o.finalDamageFee !== null && o.finalDamageFee !== undefined)
    )
  }, [orders])

  // Filter berdasarkan tab aktif dan pencarian kata kunci
  const filteredList = useMemo(() => {
    const sourceList = activeTab === 'AKTIF' ? activeDisputes : resolvedDisputes
    const query = searchQuery.trim().toLowerCase()
    if (!query) return sourceList

    return sourceList.filter((o) => {
      const invoice = (o.invoiceNumber || '').toLowerCase()
      const alat = (o.equipment?.name || '').toLowerCase()
      const penyewa = (o.user?.fullName || o.user?.kycData?.businessName || '').toLowerCase()
      const pemilik = (o.equipment?.owner?.fullName || '').toLowerCase()
      return invoice.includes(query) || alat.includes(query) || penyewa.includes(query) || pemilik.includes(query)
    })
  }, [activeTab, activeDisputes, resolvedDisputes, searchQuery])

  // Order yang sedang dipilih
  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return filteredList[0] || null
    return orders.find((o) => o.id === selectedOrderId) || filteredList[0] || null
  }, [selectedOrderId, orders, filteredList])

  // Sinkronisasi form saat order terpilih berubah
  useEffect(() => {
    if (selectedOrder) {
      if (selectedOrder.status === 'DISPUTE') {
        const initialFee = selectedOrder.damageFee || Math.round((selectedOrder.depositAmount || 0) * 0.5)
        setFinalDamageFee(initialFee)
        setAdminResolutionNote(
          `Berdasarkan peninjauan dokumentasi BAST awal dan bukti kerusakan saat pengembalian untuk ${selectedOrder.equipment?.name || 'unit alat'}, disetujui ganti rugi sebesar Rp ${initialFee.toLocaleString('id-ID')}. Sisa deposit dikembalikan ke saldo penyewa.`
        )
      } else {
        setFinalDamageFee(selectedOrder.finalDamageFee || 0)
        setAdminResolutionNote(selectedOrder.adminResolutionNote || '')
      }
    }
  }, [selectedOrderId])

  // Real-time calculation preview
  const totalDeposit = selectedOrder?.depositAmount || 0
  const rentalCostTotal = (selectedOrder?.rentalCost || 0) + (selectedOrder?.shippingCost || 0) + (selectedOrder?.addonsCost || 0)
  const currentDamageFee = Math.max(0, Math.min(Number(finalDamageFee) || 0, totalDeposit))
  const refundToRenter = totalDeposit - currentDamageFee
  const payoutToOwner = rentalCostTotal + currentDamageFee

  // Ekstraksi Foto BAST Awal
  const initialBast = selectedOrder?.initialBast || {}
  const initialPhotosObj = initialBast.photos || {}
  const initialPhotos = Array.isArray(initialPhotosObj)
    ? initialPhotosObj
    : [initialPhotosObj.front, initialPhotosObj.side, initialPhotosObj.panel, ...(initialPhotosObj.extra || [])].filter(Boolean)

  // Ekstraksi Foto BAST Akhir (Penyewa)
  const returnData = selectedOrder?.returnData || {}
  const returnPhotosObj = returnData.photos || {}
  const returnPhotos = Array.isArray(returnPhotosObj)
    ? returnPhotosObj
    : [returnPhotosObj.front, returnPhotosObj.side, returnPhotosObj.panel, ...(returnPhotosObj.extra || [])].filter(Boolean)

  // Ekstraksi Foto Bukti Kerusakan (Pemilik)
  const ownerPhotos = Array.isArray(selectedOrder?.ownerInspectionPhotos)
    ? selectedOrder.ownerInspectionPhotos
    : (selectedOrder?.ownerInspectionPhotos ? [selectedOrder.ownerInspectionPhotos] : [])

  // Eksekusi Putusan Mediasi Admin
  const handleExecuteResolution = async () => {
    if (!selectedOrder) return
    setErrorMsg('')
    setIsSubmitting(true)

    try {
      const res = await resolveDispute(selectedOrder.id, {
        finalDamageFee: currentDamageFee,
        adminResolutionNote: adminResolutionNote.trim()
      })

      showNotification(`Sengketa ${selectedOrder.invoiceNumber} berhasil diputus. Dana escrow telah dicairkan!`)
      await loadOrders()
      setActiveTab('SELESAI')
      setSelectedOrderId(selectedOrder.id)
    } catch (err) {
      setErrorMsg(err.message || 'Gagal mengeksekusi putusan mediasi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notifikasi */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Pusat Mediasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold text-slate-900">
              Pusat Mediasi &amp; Sengketa Escrow (Dispute Resolution HQ)
            </h2>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
              Independen
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Peninjauan komparasi visual BAST Awal vs Akhir, evaluasi klaim kerusakan, dan eksekusi putusan pencairan rekening escrow.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* Grid 12 Kolom: Kiri (Daftar Kasus) & Kanan (Panel Mediasi Lengkap) */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* KOLOM KIRI (4 Col): DAFTAR KASUS SENGKETA */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          
          {/* Tab Filter: Perlu Mediasi vs Riwayat Selesai */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('AKTIF')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'AKTIF'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Perlu Mediasi</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'AKTIF' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {activeDisputes.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SELESAI')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'SELESAI'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Riwayat Selesai</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'SELESAI' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {resolvedDisputes.length}
              </span>
            </button>
          </div>

          {/* Search Bar Tiket */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nomor invoice, alat, atau pihak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Daftar Tiket Sengketa */}
          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-0.5">
            {isLoading ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-blue-600" />
                <p className="text-xs">Memuat daftar tiket sengketa...</p>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-slate-800">
                  {activeTab === 'AKTIF' ? 'Tidak Ada Sengketa Aktif' : 'Belum Ada Riwayat Sengketa'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {activeTab === 'AKTIF'
                    ? 'Seluruh pesanan sewa berjalan lancar tanpa klaim sengketa.'
                    : 'Pesanan yang diselesaikan melalui mediasi akan tercatat di sini.'}
                </p>
              </div>
            ) : (
              filteredList.map((order) => {
                const isSelected = selectedOrder?.id === order.id
                const isResolved = order.status === 'SELESAI'
                const renterName = order.user?.kycData?.businessName || order.user?.fullName || 'Penyewa'
                const ownerName = order.equipment?.owner?.fullName || 'Pemilik Alat'

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-900">{order.invoiceNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isResolved ? 'Putusan Selesai' : 'Perlu Mediasi'}
                      </span>
                    </div>

                    <h4 className="mt-1.5 font-bold text-slate-900 text-xs truncate">
                      {order.equipment?.name || 'Unit Alat'}
                    </h4>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {ownerName} <span className="text-slate-300">vs</span> {renterName}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Total Deposit Escrow:</span>
                        <strong className="text-blue-700 font-bold">{formatRupiah(order.depositAmount)}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">
                          {isResolved ? 'Putusan Akhir:' : 'Tuntutan Pemilik:'}
                        </span>
                        <strong className={isResolved ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          {isResolved ? formatRupiah(order.finalDamageFee) : formatRupiah(order.damageFee)}
                        </strong>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

        </div>

        {/* KOLOM KANAN (8 Col): DETAIL SENGKETA, KOMPARASI BAST & FORM PUTUSAN */}
        <div className="col-span-12 lg:col-span-8">
          {!selectedOrder ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-2">
              <Scale className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Pilih Tiket Sengketa</h3>
              <p className="text-xs text-slate-400">Pilih pesanan dari kolom kiri untuk meninjau bukti dan memutuskan perkara.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
              
              {/* SECTION 1: HEADER INFORMASI KONTRAK & ESCROW */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {selectedOrder.invoiceNumber}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-medium">
                      Disewa {selectedOrder.rentalDays || 1} Hari ({formatShortDate(selectedOrder.startDate)} – {formatShortDate(selectedOrder.endDate)})
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {selectedOrder.equipment?.name || 'Unit Alat Produksi'}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-600 pt-0.5">
                    <span className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-slate-400" />
                      Pemilik: <strong className="text-slate-800">{selectedOrder.equipment?.owner?.fullName || 'Pemilik'}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Penyewa: <strong className="text-slate-800">{selectedOrder.user?.kycData?.businessName || selectedOrder.user?.fullName || 'Penyewa'}</strong>
                    </span>
                  </div>
                </div>

                {/* Badge Escrow Status */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-right sm:min-w-[190px]">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Dana Escrow</span>
                  <p className="text-base font-black text-blue-700 mt-0.5 tabular-nums">
                    {formatRupiah(selectedOrder.depositAmount)}
                  </p>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold inline-block mt-0.5">
                    Ditahan di Rekening Bersama
                  </span>
                </div>
              </div>

              {/* SECTION 2: ADUAN KLAIM & SANGGAHAN */}
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-rose-900 font-bold">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Tuntutan Ganti Rugi dari Pemilik: {formatRupiah(selectedOrder.damageFee)}</span>
                  </div>
                  <span className="text-[10px] bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded font-bold">
                    Klaim Pemilik
                  </span>
                </div>
                <p className="text-xs text-rose-950 font-medium leading-relaxed bg-white/80 p-3 rounded-lg border border-rose-200 m-0">
                  "{selectedOrder.disputeReason || selectedOrder.disputeNote || 'Pemilik menolak BAST akhir karena kerusakan fisik atau kehilangan kelengkapan.'}"
                </p>
              </div>

              {/* SECTION 3: KOMPARASI VISUAL BERSEBELAHAN (SIDE-BY-SIDE BAST) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>Komparasi Visual Faktual BAST (Side-by-Side)</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Bukti resmi kedua belah pihak</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* KOLOM KIRI: BAST AWAL (Sebelum Sewa) */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="text-xs font-bold text-slate-900">BAST Awal (Sebelum Sewa)</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded">
                        Kondisi Awal OK
                      </span>
                    </div>

                    {/* Galeri Foto Awal */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Foto Kondisi Serah Terima Awal:
                      </span>
                      {initialPhotos.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {initialPhotos.map((url, idx) => (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="aspect-square rounded-lg overflow-hidden bg-slate-200 border border-slate-300 hover:opacity-90 transition block group relative"
                            >
                              <img src={url} alt={`BAST Awal ${idx}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold">
                                Perbesar
                              </div>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 bg-white rounded-lg border border-slate-200 text-center text-slate-400 text-[11px]">
                          Foto kondisi awal terdaftar di sistem katalog pemilik.
                        </div>
                      )}
                    </div>

                    {/* Catatan BAST Awal */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 text-[11px]">
                      <strong className="block text-[10px] text-slate-400 uppercase font-bold">
                        Catatan Serah Terima Awal:
                      </strong>
                      <p className="text-slate-700 m-0 leading-relaxed">
                        {initialBast.notes || 'Unit diserahkan dalam kondisi prima, bodi utuh tanpa cacat, dan kelengkapan aksesoris terverifikasi.'}
                      </p>
                    </div>
                  </div>

                  {/* KOLOM KANAN: BAST AKHIR & BUKTI KLAIM (Saat Pengembalian) */}
                  <div className="p-4 bg-rose-50/30 border border-rose-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-rose-200">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        <span className="text-xs font-bold text-slate-900">BAST Akhir &amp; Bukti Kerusakan</span>
                      </div>
                      <span className="text-[10px] text-rose-700 bg-rose-100 font-bold px-2 py-0.5 rounded">
                        Klaim Sengketa
                      </span>
                    </div>

                    {/* Galeri Foto Pengembalian & Bukti Kerusakan */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Foto Pengembalian vs Bukti Klaim:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {/* Foto Penyewa */}
                        {returnPhotos.slice(0, 1).map((url, idx) => (
                          <a
                            key={`ret-${idx}`}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="aspect-square rounded-lg overflow-hidden bg-slate-200 border border-slate-300 relative group block"
                          >
                            <img src={url} alt={`Return ${idx}`} className="w-full h-full object-cover" />
                            <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] text-white text-center py-0.5">
                              Penyewa
                            </span>
                          </a>
                        ))}
                        {/* Foto Bukti Klaim Pemilik */}
                        {ownerPhotos.map((url, idx) => (
                          <a
                            key={`own-${idx}`}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="aspect-square rounded-lg overflow-hidden bg-rose-100 border-2 border-rose-500 relative group block"
                          >
                            <img src={url} alt={`Damage ${idx}`} className="w-full h-full object-cover" />
                            <span className="absolute bottom-0 inset-x-0 bg-rose-700 text-[9px] text-white font-bold text-center py-0.5">
                              Bukti Kerusakan
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Catatan Kondisi Penyewa */}
                    <div className="bg-white p-3 rounded-lg border border-rose-200 space-y-1 text-[11px]">
                      <strong className="block text-[10px] text-slate-400 uppercase font-bold">
                        Catatan Pengembalian Penyewa:
                      </strong>
                      <p className="text-slate-700 m-0 leading-relaxed">
                        {returnData.conditionNotes || returnData.notes || 'Penyewa telah menyerahkan kembali unit fisik sesuai jadwal serah terima.'}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION 4: FORM PUTUSAN FINAL ADMIN */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {selectedOrder.status === 'SELESAI'
                        ? 'Rincian Putusan Mediasi yang Telah Diterapkan'
                        : 'Formulir Putusan Final Mediasi Admin (Biaya Fleksibel)'}
                    </h4>
                  </div>
                  {selectedOrder.status === 'SELESAI' && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Diputuskan &amp; Cair
                    </span>
                  )}
                </div>

                {selectedOrder.status === 'DISPUTE' ? (
                  <>
                    {/* Preset Tombol Cepat */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-slate-500 font-semibold block">
                        Preset Keputusan Cepat:
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFinalDamageFee(0)}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Tolak Klaim (Rp 0 - Kembali 100% ke Penyewa)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFinalDamageFee(selectedOrder.damageFee || 0)}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Setujui Tuntutan Pemilik ({formatRupiah(selectedOrder.damageFee)})
                        </button>
                        <button
                          type="button"
                          onClick={() => setFinalDamageFee(Math.round(totalDeposit * 0.5))}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Bagi Rata (50:50)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFinalDamageFee(totalDeposit)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Potong 100% Deposit
                        </button>
                      </div>
                    </div>

                    {/* Input Angka Fleksibel & Slider */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800">
                          Nominal Ganti Rugi Final Disetujui (0 s/d {formatRupiah(totalDeposit)}):
                        </label>
                        <span className="text-sm font-black text-rose-600 tabular-nums">
                          {formatRupiah(currentDamageFee)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min={0}
                          max={totalDeposit}
                          step={25000}
                          value={finalDamageFee}
                          onChange={(e) => setFinalDamageFee(Number(e.target.value))}
                          className="w-44 text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 tabular-nums"
                        />
                        <input
                          type="range"
                          min={0}
                          max={totalDeposit}
                          step={10000}
                          value={currentDamageFee}
                          onChange={(e) => setFinalDamageFee(Number(e.target.value))}
                          className="flex-1 accent-blue-600 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Pratinjau Kalkulasi Pencairan Real-time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                          Pencairan ke Saldo Dompet Pemilik
                        </span>
                        <p className="text-base font-black text-rose-700 tabular-nums mt-0.5">
                          {formatRupiah(payoutToOwner)}
                        </p>
                        <p className="text-[10px] text-rose-600/80">
                          Biaya sewa ({formatRupiah(rentalCostTotal)}) + Kompensasi ({formatRupiah(currentDamageFee)})
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          Refund ke Saldo Dompet Penyewa
                        </span>
                        <p className="text-base font-black text-emerald-700 tabular-nums mt-0.5">
                          {formatRupiah(refundToRenter)}
                        </p>
                        <p className="text-[10px] text-emerald-600/80">
                          Sisa deposit yang dikembalikan utuh
                        </p>
                      </div>
                    </div>

                    {/* Input Catatan Putusan Admin */}
                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-bold text-slate-800 block">
                        Alasan / Catatan Resmi Putusan Mediasi Admin:
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tuliskan pertimbangan fakta BAST awal vs kondisi pengembalian untuk kedua belah pihak..."
                        value={adminResolutionNote}
                        onChange={(e) => setAdminResolutionNote(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 leading-relaxed"
                      />
                    </div>

                    {errorMsg && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Tombol Eksekusi Putusan */}
                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200">
                      <span className="text-[11px] text-slate-400">
                        Putusan admin bersifat mengikat dan otomatis memicu mutasi saldo escrow di database.
                      </span>

                      <button
                        type="button"
                        onClick={handleExecuteResolution}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        <Scale className="w-4 h-4" />
                        <span>{isSubmitting ? 'Mengeksekusi...' : 'Putuskan Sengketa & Cairkan Escrow'}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Tampilan Jika Sudah Diputuskan */
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Kompensasi ke Pemilik</span>
                        <p className="text-sm font-extrabold text-rose-600 mt-0.5">{formatRupiah(selectedOrder.finalDamageFee)}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Refund ke Penyewa</span>
                        <p className="text-sm font-extrabold text-emerald-600 mt-0.5">
                          {formatRupiah((selectedOrder.depositAmount || 0) - (selectedOrder.finalDamageFee || 0))}
                        </p>
                      </div>
                    </div>
                    {selectedOrder.adminResolutionNote && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Catatan Putusan:</span>
                        <p className="text-xs text-slate-700 italic m-0">"{selectedOrder.adminResolutionNote}"</p>
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  )
}
