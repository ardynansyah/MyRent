import { Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react'

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
      {/* Email Aktif */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600">
          Email Aktif *
        </label>
        <div className="relative">
          <input
            type="email"
            placeholder="nama@domain.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full bg-white text-[13px] rounded-[10px] pl-9 pr-3.5 py-2.5 text-slate-800 placeholder-slate-400 border ${
              errors.email ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all`}
          />
          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        {errors.email && <span className="text-[10px] text-red-500">{errors.email}</span>}
      </div>

      {/* Nomor WhatsApp */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600">
          Nomor WhatsApp / Telepon *
        </label>
        <div className="relative">
          <input
            type="tel"
            placeholder="0812 8899 0011"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full bg-white text-[13px] rounded-[10px] pl-9 pr-3.5 py-2.5 text-slate-800 placeholder-slate-400 border ${
              errors.phone ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all`}
          />
          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        {errors.phone && <span className="text-[10px] text-red-500">{errors.phone}</span>}
      </div>

      {/* Kata Sandi */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600">
          Kata Sandi *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimal 6 karakter"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full bg-white text-[13px] rounded-[10px] pl-9 pr-9 py-2.5 text-slate-800 placeholder-slate-400 border ${
              errors.password ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all`}
          />
          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <span className="text-[10px] text-red-500">{errors.password}</span>}
      </div>

      {/* Konfirmasi Kata Sandi */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600">
          Konfirmasi Kata Sandi *
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Ulangi kata sandi"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={`w-full bg-white text-[13px] rounded-[10px] pl-9 pr-9 py-2.5 text-slate-800 placeholder-slate-400 border ${
              errors.confirmPassword ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all`}
          />
          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className="text-[10px] text-red-500">{errors.confirmPassword}</span>
        )}
      </div>
    </div>
  )
}
