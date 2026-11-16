import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Send,
  MapPin,
  Phone,
  User,
  FileText,
  Truck,
  Store,
  CreditCard,
  Banknote,
  Smartphone,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { useCart } from '@context/CartContext'
import { useLanguage } from '@context/LanguageContext'
import { branches } from '@data/branchesData'
import { formatPrice } from '@utils'
import { sendOrderToTelegram, generateOrderNumber } from '@services/telegramService'
import { recordOrder } from '@services/adminApi'

export default function CheckoutModal({ isOpen, onClose, onSuccess }) {
  const { items, subtotal, deliveryFee, clearCart, orderNote } = useCart()
  const { t, lang } = useLanguage()

  // 1. Qabul qilish usuli: 'delivery' (Yetkazib berish) yoki 'pickup' (Filialdan olib ketish)
  const [deliveryType, setDeliveryType] = useState('delivery')

  // Filialdan olib ketish tanlanganda tanlangan filial
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || 1)

  // 2. Maydonlar
  const [name, setName] = useState('')
  const [rawPhoneDigits, setRawPhoneDigits] = useState('') // faqat 9 ta raqam (masalan: "901234567")
  const [address, setAddress] = useState('')
  const [note, setNote] = useState(orderNote || '')

  // 3. To'lov turi: 'cash', 'card_online', 'terminal'
  const [paymentMethod, setPaymentMethod] = useState('cash')

  // Validatsiya va yuklanish holatlari
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  // Filialdan olib ketilsa yetkazib berish narxi 0 bo'ladi
  const currentDeliveryFee = deliveryType === 'pickup' ? 0 : deliveryFee
  const finalTotal = subtotal + currentDeliveryFee

  // ─── TELEFON MASKASI: +998 (XX) XXX-XX-XX ───
  const formatPhoneNumber = (value) => {
    // Faqat raqamlarni ajratib olish (998 bilan kiritilsa ham tozalash)
    let digits = value.replace(/\D/g, '')

    if (digits.startsWith('998')) {
      digits = digits.slice(3)
    }

    // Maksimal 9 ta raqam (kod + raqam)
    digits = digits.slice(0, 9)
    setRawPhoneDigits(digits)

    // Maskalangan format yasash
    let formatted = '+998'
    if (digits.length > 0) formatted += ` (${digits.slice(0, 2)}`
    if (digits.length >= 2) formatted += `)`
    if (digits.length > 2) formatted += ` ${digits.slice(2, 5)}`
    if (digits.length >= 5) formatted += `-${digits.slice(5, 7)}`
    if (digits.length >= 7) formatted += `-${digits.slice(7, 9)}`

    return formatted
  }

  const handlePhoneChange = (e) => {
    formatPhoneNumber(e.target.value)
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }))
  }

  // To'liq telefon satri
  const fullPhoneString = `+998 ${rawPhoneDigits}`

  // ─── VALIDATSIYA VA YUBORISH ───
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    // 1. Ism tekshiruvi (majburiy)
    if (!name.trim()) {
      newErrors.name = lang === 'ru' ? 'Введите ваше имя' : lang === 'en' ? 'Full name is required' : 'Iltimos, ismingizni kiriting'
    }

    // 2. Telefon tekshiruvi (aniq 9 ta raqam bo'lishi shart)
    if (rawPhoneDigits.length < 9) {
      newErrors.phone = lang === 'ru' ? 'Введите полный номер телефона (9 цифр)' : lang === 'en' ? 'Complete phone number required (9 digits)' : 'Telefon raqamini to‘liq kiriting (9 ta raqam)'
    }

    // 3. Manzil tekshiruvi (faqat yetkazib berish bo'lsa)
    if (deliveryType === 'delivery' && !address.trim()) {
      newErrors.address = lang === 'ru' ? 'Укажите точный адрес доставки' : lang === 'en' ? 'Delivery address is required' : 'Yetkazib berish manzilini aniq kiriting'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    const orderNumber = generateOrderNumber()
    const currentBranch = branches.find((b) => b.id === Number(selectedBranchId))

    const orderData = {
      orderNumber,
      createdAt: new Date().toISOString(),
      deliveryType,
      selectedBranch: deliveryType === 'pickup' ? (currentBranch?.name || 'Yunusobod filiali') : null,
      paymentMethod,
      items,
      subtotal,
      deliveryFee: currentDeliveryFee,
      totalPrice: finalTotal,
      customer: {
        name: name.trim(),
        phone: `+998 (${rawPhoneDigits.slice(0, 2)}) ${rawPhoneDigits.slice(2, 5)}-${rawPhoneDigits.slice(5, 7)}-${rawPhoneDigits.slice(7, 9)}`,
        address: deliveryType === 'delivery' ? address.trim() : `Filialdan olib ketish (${currentBranch?.name})`,
      },
      note: note.trim(),
    }

    // Buyurtmani admin panelga yozish (mahalliy yoki hosted)
    try {
      await recordOrder(orderData)
    } catch (orderErr) {
      console.warn('Buyurtmani admin panelga yozishda ogohlantirish:', orderErr)
    }

    // Telegramga yuborish
    const res = await sendOrderToTelegram(orderData)

    setLoading(false)

    if (res.success) {
      clearCart()
      onClose()
      onSuccess?.(orderNumber)
    } else {
      setErrors({ form: res.message || 'Xatolik yuz berdi, qaytadan urinib ko‘ring' })
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Orqa fon qoraytirish */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="pc-overlay"
        />

        {/* Modal formasi */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative w-full max-w-xl bg-white border border-[#EDE6DC] rounded-3xl overflow-hidden shadow-warm-2xl z-50 flex flex-col max-h-[94vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#EDE6DC] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#1F1A17] leading-tight">
                  {t('checkout.title')}
                </h3>
                <span className="text-xs text-[#6B5E55]">
                  Plov City — Besh Qozon buyurtma markazi
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-[#EDE6DC] text-[#1F1A17] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Yopish"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form qismi */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            {/* Umumiy xatolik bo'lsa */}
            {errors.form && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-bold flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* ─── 1. QABUL QILISH USULI (TABS) ─── */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1F1A17] mb-2">
                {t('checkout.deliveryType')}
              </label>

              <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF7F2] rounded-2xl border border-[#EDE6DC]">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`py-2.5 px-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    deliveryType === 'delivery'
                      ? 'bg-[#D94E1F] text-white shadow-brand-sm'
                      : 'text-[#6B5E55] hover:text-[#1F1A17]'
                  }`}
                >
                  <Truck size={16} />
                  <span>{t('checkout.delivery')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`py-2.5 px-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    deliveryType === 'pickup'
                      ? 'bg-[#D94E1F] text-white shadow-brand-sm'
                      : 'text-[#6B5E55] hover:text-[#1F1A17]'
                  }`}
                >
                  <Store size={16} />
                  <span>{t('checkout.pickup')}</span>
                </button>
              </div>
            </div>

            {/* ─── 2. MIJOZ ISMI VA TELEFON RAQAMI ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ism */}
              <div>
                <label className="block text-xs font-bold text-[#1F1A17] mb-1.5">
                  {t('checkout.name')} <span className="text-[#D94E1F]">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B5E55]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (errors.name) setErrors((prev) => ({ ...prev, name: null }))
                    }}
                    placeholder={t('checkout.namePlaceholder')}
                    className={`pc-input pl-10 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-[11px] font-bold text-red-600 mt-1">{errors.name}</p>}
              </div>

              {/* Telefon (Avtomatik +998 (__) ___-__-__ formati) */}
              <div>
                <label className="block text-xs font-bold text-[#1F1A17] mb-1.5">
                  {t('checkout.phone')} <span className="text-[#D94E1F]">*</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B5E55]" />
                  <input
                    type="tel"
                    value={formatPhoneNumber(rawPhoneDigits)}
                    onChange={handlePhoneChange}
                    placeholder="+998 (90) 123-45-67"
                    className={`pc-input pl-10 font-mono tracking-wide ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] font-bold text-red-600 mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* ─── 3. MANZIL YOKI FILIALNI TANLASH ─── */}
            {deliveryType === 'delivery' ? (
              <div>
                <label className="block text-xs font-bold text-[#1F1A17] mb-1.5">
                  {t('checkout.address')} <span className="text-[#D94E1F]">*</span>
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-3 text-[#6B5E55]" />
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value)
                      if (errors.address) setErrors((prev) => ({ ...prev, address: null }))
                    }}
                    placeholder={t('checkout.addressPlaceholder')}
                    className={`pc-input pl-10 resize-none ${errors.address ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                </div>
                {errors.address && <p className="text-[11px] font-bold text-red-600 mt-1">{errors.address}</p>}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-[#1F1A17] mb-1.5">
                  Olib ketish filialini tanlang: <span className="text-[#D94E1F]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {branches.map((b) => {
                    const isSelected = Number(selectedBranchId) === b.id
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBranchId(b.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'border-[#D94E1F] bg-[#FEF0EB] text-[#1F1A17] shadow-warm-xs'
                            : 'border-[#EDE6DC] bg-[#FAF7F2] text-[#6B5E55] hover:border-[#D94E1F]/40'
                        }`}
                      >
                        <div className="text-xl mb-1">{b.emoji}</div>
                        <div className="text-xs font-bold text-[#1F1A17] leading-tight">
                          {b.name}
                        </div>
                        <div className="text-[10px] text-[#6B5E55] mt-1 line-clamp-1">
                          {b.address}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ─── 4. TO'LOV TURI ─── */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1F1A17] mb-2">
                {t('checkout.paymentMethod')}
              </label>

              <div className="grid grid-cols-3 gap-2">
                {/* Naqd pul */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'border-[#D94E1F] bg-[#FEF0EB] text-[#D94E1F] font-bold shadow-warm-xs'
                      : 'border-[#EDE6DC] bg-[#FAF7F2] text-[#6B5E55] hover:text-[#1F1A17]'
                  }`}
                >
                  <Banknote size={20} />
                  <span className="text-xs font-bold leading-tight">Naqd pul</span>
                </button>

                {/* Click / Payme */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card_online')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'card_online'
                      ? 'border-[#D94E1F] bg-[#FEF0EB] text-[#D94E1F] font-bold shadow-warm-xs'
                      : 'border-[#EDE6DC] bg-[#FAF7F2] text-[#6B5E55] hover:text-[#1F1A17]'
                  }`}
                >
                  <Smartphone size={20} />
                  <span className="text-xs font-bold leading-tight">Click / Payme</span>
                </button>

                {/* Terminal */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('terminal')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'terminal'
                      ? 'border-[#D94E1F] bg-[#FEF0EB] text-[#D94E1F] font-bold shadow-warm-xs'
                      : 'border-[#EDE6DC] bg-[#FAF7F2] text-[#6B5E55] hover:text-[#1F1A17]'
                  }`}
                >
                  <CreditCard size={20} />
                  <span className="text-xs font-bold leading-tight">Terminal</span>
                </button>
              </div>
            </div>

            {/* ─── 5. KURYER UCHUN IZOH MAYDONI ─── */}
            <div>
              <label className="block text-xs font-bold text-[#1F1A17] mb-1.5">
                {t('checkout.comment')}
              </label>
              <div className="relative">
                <FileText size={16} className="absolute left-3.5 top-3 text-[#6B5E55]" />
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t('checkout.commentPlaceholder')}
                  className="pc-input pl-10 resize-none text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Hisob-kitob cheki */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE6DC] space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-[#6B5E55]">
                <span>{t('cart.subtotal')}:</span>
                <span className="font-bold text-[#1F1A17]">{formatPrice(subtotal)} {t('units.currency')}</span>
              </div>
              <div className="flex justify-between items-center text-[#6B5E55]">
                <span>{t('cart.delivery')}:</span>
                {currentDeliveryFee === 0 ? (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <Sparkles size={12} />
                    {t('cart.free')}
                  </span>
                ) : (
                  <span className="font-bold text-[#1F1A17]">{formatPrice(currentDeliveryFee)} {t('units.currency')}</span>
                )}
              </div>
              <div className="h-px bg-[#EDE6DC] my-1" />
              <div className="flex justify-between items-center pt-0.5">
                <span className="text-sm font-extrabold text-[#1F1A17]">{t('cart.total')}:</span>
                <span className="text-xl sm:text-2xl font-black text-[#E69D24] leading-none">
                  {formatPrice(finalTotal)} {t('units.currency')}
                </span>
              </div>
            </div>

            {/* ─── BUYURTMANI TASDIQLASH TUGMASI (SPINNER BILAN) ─── */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-lg w-full gap-2 justify-center shadow-brand-md text-base font-extrabold active:scale-95 cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{t('checkout.submitting') || 'Yuborilmoqda...'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send size={18} />
                  <span>{t('checkout.submit')} — {formatPrice(finalTotal)} {t('units.currency')}</span>
                </div>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
