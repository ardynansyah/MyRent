/**
 * CheckoutWizard.jsx
 *
 * Container utama untuk alur Checkout 3-langkah (Step 1 → Step 2 → Step 3).
 * State wizard disimpan di sini dan diteruskan ke masing-masing step sebagai props.
 *
 * Route:
 *  - /checkout/:equipmentId          → Step 1 (Rincian Sewa)
 *  - /checkout/:equipmentId/kontrak  → Step 2 (Kontrak Digital)
 *  - /checkout/pembayaran/:orderId   → Step 3 (Pembayaran)
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useLocation, useNavigate, Routes, Route } from 'react-router-dom'
import CheckoutStep1 from './CheckoutStep1'
import CheckoutStep2 from './CheckoutStep2'
import CheckoutStep3 from './CheckoutStep3'
import { getEquipment } from '../../lib/equipmentsApi'

export default function CheckoutWizard() {
  const { equipmentId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  // ── Shared wizard state ────────────────────────────────────────────────────
  const [wizardData, setWizardData] = useState(() => {
    // Ambil state yang di-pass dari DetailAlat (via navigate state)
    const fromDetail = location.state || {}
    return {
      equipmentId: equipmentId || fromDetail.equipmentId,
      selectionStart: fromDetail.selectionStart || null,
      selectionEnd: fromDetail.selectionEnd || null,
      deliveryMethod: fromDetail.deliveryMethod || 'PICKUP',
      addons: [],
      addonsCost: 0,
      promoCode: '',
      discountAmount: 0,
      renterNotes: '',
      contractAgreedAt: null,
      // Step 2 result
      orderId: null,
      invoiceNumber: null,
      totalPaid: 0
    }
  })

  const updateWizard = useCallback((patch) => {
    setWizardData(prev => ({ ...prev, ...patch }))
  }, [])

  // Navigasi step
  const goToStep2 = () => navigate(`/checkout/${wizardData.equipmentId}/kontrak`, { state: wizardData })
  const goToStep3 = (orderId) => navigate(`/checkout/pembayaran/${orderId}`, { state: wizardData })
  const goBackToStep1 = () => navigate(`/checkout/${wizardData.equipmentId}`, { state: wizardData })

  return (
    <Routes>
      <Route
        path="/"
        element={
          <CheckoutStep1
            wizardData={wizardData}
            updateWizard={updateWizard}
            onNext={goToStep2}
          />
        }
      />
      <Route
        path="/kontrak"
        element={
          <CheckoutStep2
            wizardData={wizardData}
            updateWizard={updateWizard}
            onBack={goBackToStep1}
            onNext={goToStep3}
          />
        }
      />
    </Routes>
  )
}
