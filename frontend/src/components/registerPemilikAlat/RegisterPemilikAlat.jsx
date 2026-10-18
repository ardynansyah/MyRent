import { useState } from 'react'
import RegisterTopBar from './RegisterTopBar'
import RegisterStepper from './RegisterStepper'
import Step1BuatAkun from './Step1BuatAkun'
import Step2IdentitasKTP from './Step2IdentitasKTP'
import Step3GudangOperasional from './Step3GudangOperasional'
import Step4RekeningPencairan from './Step4RekeningPencairan'
import Step5ReviewKirim from './Step5ReviewKirim'

const TOTAL_STEPS = 5

/**
 * Container alur pendaftaran Pemilik Alat (5 langkah).
 * Konversi dari mockup HTML frontend/AssetMyRent/register1-5PenyewaAlat.html.
 */
export default function RegisterPemilikAlat({ onBackToLogin, onFinish, onSwitchToPenyewa }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [notification, setNotification] = useState('')

  const notify = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 3500)
  }

  const goNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((step) => step + 1)
    } else if (onFinish) {
      onFinish()
    } else {
      notify('Data verifikasi berhasil dikirim.')
    }
  }

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1)
    } else if (onBackToLogin) {
      onBackToLogin()
    }
  }

  const saveDraft = () => notify('Draf pendaftaran tersimpan.')

  const stepProps = {
    onBack: goBack,
    onNext: goNext,
    onSaveDraft: saveDraft,
    onNotify: notify
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Toast Notifikasi */}
      {notification && (
        <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs sm:text-sm font-medium border border-slate-700/60 animate-in fade-in slide-in-from-top-4 duration-300 max-w-[90vw]">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Bar: brand + konteks pendaftaran + tautan masuk */}
      <RegisterTopBar onLoginClick={onBackToLogin} />

      {/* Body: panel stepper (kiri) + kartu form (kanan) */}
      <main className="w-full max-w-[1140px] flex-1 flex flex-col lg:flex-row gap-9 pt-8 pb-11 px-4 sm:px-6">
        <RegisterStepper currentStep={currentStep} />

        <div className="flex-1 min-w-0 flex flex-col items-center lg:items-start">
          {currentStep === 1 && (
            <Step1BuatAkun {...stepProps} onSwitchToPenyewa={onSwitchToPenyewa} />
          )}
          {currentStep === 2 && <Step2IdentitasKTP {...stepProps} />}
          {currentStep === 3 && <Step3GudangOperasional {...stepProps} />}
          {currentStep === 4 && <Step4RekeningPencairan {...stepProps} />}
          {currentStep === 5 && <Step5ReviewKirim {...stepProps} />}
        </div>
      </main>
    </div>
  )
}
