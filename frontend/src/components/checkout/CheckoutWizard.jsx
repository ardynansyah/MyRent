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
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import CheckoutStep1 from './CheckoutStep1'
import CheckoutStep2 from './CheckoutStep2'

export default function CheckoutWizard() {
  const { equipmentId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  // ── Shared wizard state ────────────────────────────────────────────────────
  const [wizardData, setWizardData] = useState(() => {
    // Ambil state yang di-pass dari DetailAlat (via navigate state) atau sessionStorage draft
    const fromDetail = location.state || {}
    const draftKey = equipmentId ? `checkout_draft_${equipmentId}` : null
    let draft = {}
    if (draftKey) {
      try {
        const stored = sessionStorage.getItem(draftKey)
        if (stored) draft = JSON.parse(stored)
      } catch {
        // ignore parse error
      }
    }
    return {
      equipmentId: equipmentId || fromDetail.equipmentId || draft.equipmentId,
      selectionStart: fromDetail.selectionStart || draft.selectionStart || null,
      selectionEnd: fromDetail.selectionEnd || draft.selectionEnd || null,
      deliveryMethod: fromDetail.deliveryMethod || draft.deliveryMethod || 'PICKUP',
      addons: fromDetail.addons || draft.addons || [],
      addonsCost: fromDetail.addonsCost || draft.addonsCost || 0,
      promoCode: fromDetail.promoCode || draft.promoCode || '',
      discountAmount: fromDetail.discountAmount || draft.discountAmount || 0,
      renterNotes: fromDetail.renterNotes || draft.renterNotes || '',
      contractAgreedAt: fromDetail.contractAgreedAt || draft.contractAgreedAt || null,
      isAgreed: fromDetail.isAgreed || draft.isAgreed || Boolean(fromDetail.contractAgreedAt || draft.contractAgreedAt) || false,
      rentalCost: fromDetail.rentalCost || draft.rentalCost || 0,
      shippingCost: fromDetail.shippingCost || draft.shippingCost || 0,
      depositAmount: fromDetail.depositAmount || draft.depositAmount || 0,
      // Step 2 result
      orderId: fromDetail.orderId || null,
      invoiceNumber: fromDetail.invoiceNumber || null,
      totalPaid: fromDetail.totalPaid || draft.totalPaid || 0
    }
  })

  // Sinkronisasi equipmentId jika berubah dari params
  useEffect(() => {
    if (equipmentId && wizardData.equipmentId !== equipmentId) {
      setWizardData(prev => ({ ...prev, equipmentId }))
    }
  }, [equipmentId, wizardData.equipmentId])

  const updateWizard = useCallback((patch) => {
    setWizardData(prev => ({ ...prev, ...patch }))
  }, [])

  // Navigasi step
  const goToStep2 = (patch) => {
    const nextState = patch ? { ...wizardData, ...patch } : wizardData
    if (patch) {
      setWizardData(nextState)
    }
    const targetId = equipmentId || nextState.equipmentId
    navigate(`/checkout/${targetId}/kontrak`, { state: nextState })
  }

  const goBackToStep1 = () => {
    const targetId = equipmentId || wizardData.equipmentId
    navigate(`/checkout/${targetId}`, { state: wizardData })
  }

  const goToStep3 = (orderId) => {
    navigate(`/checkout/pembayaran/${orderId}`, { state: wizardData })
  }

  // Cek apakah user sedang berada di sub-path /kontrak (Step 2)
  const isKontrak = location.pathname.replace(/\/+$/, '').endsWith('/kontrak')

  return isKontrak ? (
    <CheckoutStep2
      wizardData={wizardData}
      updateWizard={updateWizard}
      onBack={goBackToStep1}
      onNext={goToStep3}
    />
  ) : (
    <CheckoutStep1
      wizardData={wizardData}
      updateWizard={updateWizard}
      onNext={goToStep2}
    />
  )
}
