import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, Check, AlertCircle, Zap, Power, AlertTriangle } from 'lucide-react'
import { formatRupiah } from '../../lib/equipmentsApi'

const PRESET_IMAGES = [
  { label: 'Mesin Kopi', url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80' },
  { label: 'Oven Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mesin Kemasan', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' },
  { label: 'Konveksi', url: 'https://images.unsplash.com/photo-1528458876885-5b6eacdd3671?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mixer Planetary', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80' }
]

const CATEGORY_OPTIONS = [
  'Mesin Kopi',
  'Oven & Bakery',
  'Mesin Kemasan',
  'Konveksi',
  'Peralatan Dapur',
  'Pendingin & Freezer',
  'Lainnya'
]

export default function ModalKelolaAlat({
  isOpen,
  equipment,
  onClose,
  onUpdate,
  onDelete
}) {
  if (!isOpen || !equipment) return null

  const [formData, setFormData] = useState({
    name: equipment.name || '',
    category: equipment.category || 'Mesin Kopi',
    description: equipment.description || '',
    condition: equipment.condition || 'Prima',
    pricePerDay: equipment.pricePerDay || '',
    deposit: equipment.deposit || '',
    powerWatt: equipment.powerWatt || '',
    minRentDays: equipment.minRentDays || 1,
    maintenanceBufferDays: equipment.maintenanceBufferDays || 1,
    location: equipment.location || 'Jakarta Selatan',
    weightKg: equipment.weightKg || 10,
    dimensions: equipment.dimensions || '40 × 30 × 30 cm',
    stock: equipment.stock || 1
  })

  // Multi-foto state
  const [images, setImages] = useState(
    Array.isArray(equipment.images) && equipment.images.length > 0
      ? equipment.images
      : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80']
  )
  const [newImageUrl, setNewImageUrl] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)

  // Kelengkapan / aksesoris
  const [accessories, setAccessories] = useState(
    Array.isArray(equipment.accessories) && equipment.accessories.length > 0
      ? equipment.accessories
      : ['Kabel Power', 'Buku Panduan']
  )
  const [newAccessory, setNewAccessory] = useState('')

  // Metode pengiriman
  const initialDelivery = Array.isArray(equipment.deliveryMethods)
    ? equipment.deliveryMethods
    : ['PICKUP', 'COURIER']
  const [deliveryPickup, setDeliveryPickup] = useState(initialDelivery.includes('PICKUP'))
  const [deliveryCourier, setDeliveryCourier] = useState(initialDelivery.includes('COURIER'))
  const [deliveryFee, setDeliveryFee] = useState(equipment.deliveryFee ?? 45000)

  // Status Aktif Toggle
  const [isActive, setIsActive] = useState(equipment.status !== 'NONAKTIF' && !equipment.isDeleted)

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState('')

  // Re-sync state saat equipment prop berubah
  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name || '',
        category: equipment.category || 'Mesin Kopi',
        description: equipment.description || '',
        condition: equipment.condition || 'Prima',
        pricePerDay: equipment.pricePerDay || '',
        deposit: equipment.deposit || '',
        powerWatt: equipment.powerWatt || '',
        minRentDays: equipment.minRentDays || 1,
        maintenanceBufferDays: equipment.maintenanceBufferDays || 1,
        location: equipment.location || 'Jakarta Selatan',
        weightKg: equipment.weightKg || 10,
        dimensions: equipment.dimensions || '40 × 30 × 30 cm',
        stock: equipment.stock || 1
      })
      setImages(
        Array.isArray(equipment.images) && equipment.images.length > 0
          ? equipment.images
          : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80']
      )
      setAccessories(
        Array.isArray(equipment.accessories) && equipment.accessories.length > 0
          ? equipment.accessories
          : ['Kabel Power', 'Buku Panduan']
      )
      const deliv = Array.isArray(equipment.deliveryMethods)
        ? equipment.deliveryMethods
        : ['PICKUP', 'COURIER']
      setDeliveryPickup(deliv.includes('PICKUP'))
      setDeliveryCourier(deliv.includes('COURIER'))
      setDeliveryFee(equipment.deliveryFee !== undefined && equipment.deliveryFee !== null ? equipment.deliveryFee : 45000)
      setIsActive(equipment.status !== 'NONAKTIF' && !equipment.isDeleted)
      setConfirmDelete(false)
      setError('')
    }
  }, [equipment])

  const handleAddImage = (url) => {
    const trimmed = (url || newImageUrl).trim()
    if (!trimmed) return
    if (!images.includes(trimmed)) {
      setImages([...images, trimmed])
    }
    setNewImageUrl('')
    setShowUrlInput(false)
  }

  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove))
  }

  const handleAddAccessory = () => {
    const trimmed = newAccessory.trim()
    if (!trimmed) return
    if (!accessories.includes(trimmed)) {
      setAccessories([...accessories, trimmed])
    }
    setNewAccessory('')
  }

  const handleRemoveAccessory = (itemToRemove) => {
    setAccessories(accessories.filter((item) => item !== itemToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Nama alat wajib diisi')
      return
    }
    if (!formData.pricePerDay || Number(formData.pricePerDay) <= 0) {
      setError('Harga sewa harian wajib diisi dengan nominal positif')
      return
    }
    if (!formData.deposit || Number(formData.deposit) <= 0) {
      setError('Deposit pengaman wajib diisi')
      return
    }
    if (!deliveryPickup && !deliveryCourier) {
      setError('Pilih minimal satu metode pengiriman')
      return
    }
    if (deliveryCourier && (isNaN(Number(deliveryFee)) || Number(deliveryFee) < 0)) {
      setError('Tarif ongkos kirim kurir toko harus berupa angka non-negatif')
      return
    }

    const deliveryMethods = []
    if (deliveryPickup) deliveryMethods.push('PICKUP')
    if (deliveryCourier) deliveryMethods.push('COURIER')

    setLoading(true)
    try {
      await onUpdate(equipment.id, {
        ...formData,
        pricePerDay: Number(formData.pricePerDay),
        deposit: Number(formData.deposit),
        powerWatt: Number(formData.powerWatt) || 0,
        minRentDays: Math.max(1, Number(formData.minRentDays) || 1),
        maintenanceBufferDays: Math.max(0, Number(formData.maintenanceBufferDays) || 1),
        weightKg: Number(formData.weightKg) || 10,
        stock: Math.max(1, Number(formData.stock) || 1),
        accessories,
        deliveryMethods,
        deliveryFee: deliveryCourier ? Math.max(0, Number(deliveryFee) || 0) : 0,
        images: images.length > 0 ? images : equipment.images,
        isActive,
        status: isActive ? (equipment.status === 'NONAKTIF' ? 'TERSEDIA' : equipment.status) : 'NONAKTIF'
      })
      onClose()
    } catch (err) {
      setError(err?.message || 'Gagal menyimpan perubahan alat')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    setError('')
    try {
      await onDelete(equipment.id)
      onClose()
    } catch (err) {
      setError(err?.message || 'Gagal menghapus alat')
      setDeleteLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200/90 max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden font-sans">
        {/* Header Modal */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Kelola Alat
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {isActive ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Perbarui detail spesifikasi, foto, aturan sewa, dan ketersediaan alat Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body Scrollable */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-slate-800">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-xs text-red-700 font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ── 1. MANAJEMEN MULTI-FOTO ─────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold tracking-wider text-slate-500 uppercase">
                FOTO ALAT · {images.length} FOTO
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah foto</span>
              </button>
            </div>

            {/* Gallery Thumbnail Cards */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-xs"
                >
                  <img
                    src={imgUrl}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
                    }}
                  />
                  {idx === 0 && (
                    <div className="absolute top-1 left-1 bg-blue-600 text-[9px] font-bold text-white px-1.5 py-0.5 rounded shadow-xs">
                      Utama
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    title="Hapus foto"
                    className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-blue-600 transition-all shrink-0 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[10px] font-bold">Foto</span>
              </button>
            </div>

            {/* URL input popover */}
            {showUrlInput && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5 animate-in fade-in">
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Masukkan URL foto baru..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 bg-white text-xs rounded-lg px-3 py-2 border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImage()}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Tambah
                  </button>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500 font-medium">Preset:</span>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleAddImage(preset.url)}
                      className="px-2 py-0.5 rounded-md bg-white hover:bg-blue-50 border border-slate-200 text-[10px] font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── 2. INFORMASI DASAR ─────────────────────────────────────── */}
          <div className="space-y-3.5 pt-1 border-t border-slate-100">
            <label className="text-xs font-extrabold tracking-wider text-slate-500 uppercase">
              INFORMASI DASAR
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Nama alat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 text-xs rounded-xl px-3 py-2.5 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-medium"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Deskripsi alat <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 text-xs rounded-xl p-3 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Kondisi Alat
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full bg-slate-50 text-xs rounded-xl px-3 py-2.5 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-medium"
                >
                  <option value="Prima">Prima (Like New)</option>
                  <option value="Terawat">Terawat (Sangat Baik)</option>
                  <option value="Baik">Baik (Normal Operasional)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── 3. SPESIFIKASI, ATURAN & FINANSIAL ───────────────────────── */}
          <div className="space-y-3.5 pt-1 border-t border-slate-100">
            <label className="text-xs font-extrabold tracking-wider text-slate-500 uppercase">
              SPESIFIKASI &amp; ATURAN SEWA
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Daya listrik (Watt)</span>
                </label>
                <input
                  type="number"
                  value={formData.powerWatt}
                  onChange={(e) => setFormData({ ...formData, powerWatt: e.target.value })}
                  className="w-full bg-slate-50 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Minimal hari sewa
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={formData.minRentDays}
                    onChange={(e) => setFormData({ ...formData, minRentDays: e.target.value })}
                    className="w-full bg-slate-50 text-xs rounded-xl px-3.5 py-2.5 pr-10 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-medium"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">hari</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Jeda perawatan (Buffer)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={formData.maintenanceBufferDays}
                    onChange={(e) => setFormData({ ...formData, maintenanceBufferDays: e.target.value })}
                    className="w-full bg-slate-50 text-xs rounded-xl px-3.5 py-2.5 pr-10 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-medium"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">hari</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Harga sewa harian (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                  className="w-full bg-slate-50 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-medium"
                />
                {formData.pricePerDay && (
                  <div className="text-[11px] font-bold text-blue-600">
                    {formatRupiah(formData.pricePerDay)} <span className="font-normal text-slate-400">/ hari</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Deposit pengaman (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                  className="w-full bg-slate-50 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-medium"
                />
                {formData.deposit && (
                  <div className="text-[11px] font-bold text-emerald-600">
                    Deposit {formatRupiah(formData.deposit)}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Lokasi Gudang / Toko
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-50 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Berat (kg)
                </label>
                <input
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                  className="w-full bg-slate-50 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Dimensi (P × L × T)
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="w-full bg-slate-50 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* ── 4. KELENGKAPAN & METODE PENGIRIMAN ──────────────────────── */}
          <div className="space-y-3.5 pt-1 border-t border-slate-100">
            <label className="text-xs font-extrabold tracking-wider text-slate-500 uppercase">
              KELENGKAPAN &amp; METODE PENGIRIMAN
            </label>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Kelengkapan / Aksesoris Termasuk
              </label>
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 min-h-[42px]">
                {accessories.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/80 animate-in fade-in"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAccessory(item)}
                      className="text-blue-400 hover:text-blue-800 cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <div className="flex items-center gap-1 flex-1 min-w-[130px]">
                  <input
                    type="text"
                    placeholder="+ Tambah item…"
                    value={newAccessory}
                    onChange={(e) => setNewAccessory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddAccessory()
                      }
                    }}
                    className="w-full bg-transparent text-xs px-2 py-1 text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  {newAccessory.trim() && (
                    <button
                      type="button"
                      onClick={handleAddAccessory}
                      className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold cursor-pointer"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700">
                Metode Pengiriman
              </label>
              <div className="flex flex-wrap items-center gap-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={deliveryPickup}
                    onChange={(e) => setDeliveryPickup(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-800">
                    Ambil di gudang / toko
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={deliveryCourier}
                    onChange={(e) => setDeliveryCourier(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-800">
                    Diantar kurir toko
                  </span>
                </label>
              </div>

              {/* Input custom ongkir jika Diantar Kurir Toko aktif */}
              {deliveryCourier && (
                <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl space-y-1.5 transition-all animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      Tarif Ongkos Kirim Kurir Toko
                    </label>
                    <span className="text-[11px] text-blue-700 font-semibold">
                      Rp {Number(deliveryFee || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(e.target.value)}
                      placeholder="45000"
                      className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 m-0">
                    Biaya kirim yang akan ditagihkan ke penyewa jika memilih diantar kurir.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── 5. KONTROL EKSKLUSIF KELOLA ALAT ─────────────────────────── */}
          <div className="space-y-3.5 pt-1 border-t border-slate-100">
            {/* Toggle Status Aktif */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Alat Aktif</span>
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                  {isActive
                    ? 'Tampilkan alat ini kepada penyewa di katalog publik'
                    : 'Sembunyikan alat ini sementara dari katalog publik penyewa'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isActive ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Danger Zone: Hapus Alat */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold tracking-wider text-red-600 uppercase">
                HAPUS ALAT (DANGER ZONE)
              </label>

              <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-red-900">
                    Hapus dengan aman (Safe Delete)
                  </div>
                  <div className="text-[11px] text-red-600 font-medium">
                    Riwayat pesanan lama tetap tersimpan aman di database tanpa merusak laporan transaksi.
                  </div>
                </div>

                {!confirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="px-3.5 py-1.5 rounded-xl border border-red-300 bg-white hover:bg-red-100/60 text-red-600 text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Hapus alat
                  </button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-white"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {deleteLoading ? 'Menghapus...' : 'Ya, Hapus'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || deleteLoading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || deleteLoading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
