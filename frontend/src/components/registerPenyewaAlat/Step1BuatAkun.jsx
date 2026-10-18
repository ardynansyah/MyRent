import { Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react'
import { SECTORS } from './constants'

export default function Step1BuatAkun({
  formData,
  handleInputChange,
  errors,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword
}) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nama Lengkap */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            Nama Lengkap Penanggung Jawab *
          </label>
          <input
            type="text"
            placeholder="Contoh: Budi Santoso"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
              errors.fullName ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.fullName && <span className="text-[10px] text-red-500">{errors.fullName}</span>}
        </div>

        {/* Nama Usaha / UMKM */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            Nama Usaha / UMKM *
          </label>
          <input
            type="text"
            placeholder="Contoh: Kopi Senja Roastery"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
              errors.businessName ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.businessName && <span className="text-[10px] text-red-500">{errors.businessName}</span>}
        </div>
      </div>

      {/* Sektor Usaha Dropdown */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold text-[#475569]">
          Sektor Usaha Utama *
        </label>
        <select
          value={formData.businessSector}
          onChange={(e) => handleInputChange('businessSector', e.target.value)}
          className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all cursor-pointer"
        >
          {SECTORS.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email Aktif */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            Email Aktif *
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="nama@domain.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full bg-white text-[13px] rounded-[10px] pl-9 pr-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                errors.email ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
              } focus:outline-none focus:ring-2 transition-all`}
            />
            <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          {errors.email && <span className="text-[10px] text-red-500">{errors.email}</span>}
        </div>

        {/* Nomor WhatsApp */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            Nomor WhatsApp / Telepon *
          </label>
          <div className="relative">
            <input
              type="tel"
              placeholder="0812 8899 0011"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full bg-white text-[13px] rounded-[10px] pl-9 pr-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                errors.phone ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
              } focus:outline-none focus:ring-2 transition-all`}
            />
            <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          {errors.phone && <span className="text-[10px] text-red-500">{errors.phone}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Kata Sandi */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            Kata Sandi *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimal 6 karakter"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full bg-white text-[13px] rounded-[10px] pl-9 pr-9 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                errors.password ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
              } focus:outline-none focus:ring-2 transition-all`}
            />
            <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <span className="text-[10px] text-red-500">{errors.password}</span>}
        </div>

        {/* Konfirmasi Kata Sandi */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            Konfirmasi Kata Sandi *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Ulangi kata sandi"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full bg-white text-[13px] rounded-[10px] pl-9 pr-9 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                errors.confirmPassword ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
              } focus:outline-none focus:ring-2 transition-all`}
            />
            <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-[10px] text-red-500">{errors.confirmPassword}</span>
          )}
        </div>
      </div>
    </div>
  )
}
