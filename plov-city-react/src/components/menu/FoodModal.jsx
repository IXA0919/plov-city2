import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Clock, Flame, Check, Sparkles, UtensilsCrossed } from 'lucide-react'
import { useCart, generateCartItemId } from '@context/CartContext'
import { useLanguage } from '@context/LanguageContext'
import { formatPrice } from '@utils'

export default function FoodModal({ item, isOpen, onClose }) {
  const { addItem } = useCart()
  const { t, lang } = useLanguage()
  const [imageError, setImageError] = useState(false)

  // 1. Tanlangan variant (agar osh turlari bo'lsa)
  const [selectedVariant, setSelectedVariant] = useState(
    item?.initialVariant || (item?.variants && item.variants.length > 0 ? item.variants[0] : null)
  )

  // 2. Tanlangan qo'shimchalar (Optional Add-ons)
  const [selectedAddons, setSelectedAddons] = useState([])

  // 3. Miqdor tanlagich (- 1 +)
  const [quantity, setQuantity] = useState(1)

  // Agar modal yopiq bo'lsa yoki item bo'lmasa render qilinmaydi
  if (!isOpen || !item) return null

  // Ko'p tilli nom va tavsif
  const displayName = item.name?.[lang] || item.nameUz || item.name?.uz || 'Osh'
  const displayDesc = item.description?.[lang] || item.descUz || item.description?.uz || ''

  // Tavsiya etiladigan qo'shimchalar ro'yxati (Besh Qozon uslubida)
  const availableAddons = [
    {
      id: 'addon-qazi',
      name: { uz: 'Ot go‘shtli Qazi (2 bo‘lak)', ru: 'Казы из конины (2 кусочка)', en: 'Horsemeat Kazy (2 pcs)' },
      price: 15000,
      emoji: '🥩',
    },
    {
      id: 'addon-quail-eggs',
      name: { uz: 'Bedana tuxumi (3 dona)', ru: 'Перепелиные яйца (3 шт)', en: 'Quail Eggs (3 pcs)' },
      price: 6000,
      emoji: '🥚',
    },
    {
      id: 'addon-achichuk',
      name: { uz: 'Achichuk pomidor salati', ru: 'Салат Ачик-чучук', en: 'Achichuk Tomato Salad' },
      price: 10000,
      emoji: '🍅',
    },
    {
      id: 'addon-dolma',
      name: { uz: 'Uzum bargli Dolma (4 dona)', ru: 'Долма в виноградных листьях', en: 'Stuffed Grape Leaves Dolma' },
      price: 18000,
      emoji: '🍃',
    },
    {
      id: 'addon-suzma',
      name: { uz: 'Qatiqli Suzma ko‘katlar bilan', ru: 'Сузьма с зеленью', en: 'Strained Yogurt Suzma' },
      price: 8000,
      emoji: '🥣',
    },
    {
      id: 'addon-garlic',
      name: { uz: 'Qozonda pishgan sarimsoqpiyoz', ru: 'Печёный чеснок из казана', en: 'Slow-cooked Whole Garlic' },
      price: 5000,
      emoji: '🧄',
    },
  ]

  // Qo'shimcha chekboxini bosganda qo'shish/olib tashlash
  const toggleAddon = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id)
      if (exists) {
        return prev.filter((a) => a.id !== addon.id)
      } else {
        return [...prev, addon]
      }
    })
  }

  // Narx hisob-kitobi: (Asosiy variant narxi + Qo'shimchalar summasi) * Miqdor
  const basePrice = selectedVariant ? selectedVariant.price : (item.price || 0)
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0)
  const unitPrice = basePrice + addonsTotal
  const finalTotalPrice = unitPrice * quantity

  // Savatchaga qo'shish
  const handleAddToCart = () => {
    const variantWeight = selectedVariant
      ? (selectedVariant[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || selectedVariant.weight)
      : item.weight

    const addonsText = selectedAddons.length > 0
      ? ` + ${selectedAddons.map(a => a.name[lang] || a.name.uz).join(', ')}`
      : ''

    const cartTitle = `${displayName}${variantWeight ? ` (${variantWeight})` : ''}${addonsText}`

    const cartItemId = generateCartItemId({
      id: item.id,
      selectedVariant: selectedVariant,
      selectedAddons: selectedAddons,
    })

    addItem({
      id: item.id,
      cartItemId: cartItemId,
      name: item.name,
      nameUz: cartTitle,
      price: unitPrice,
      unitPrice: unitPrice,
      weight: variantWeight || item.weight,
      selectedVariant: selectedVariant,
      selectedAddons: selectedAddons,
      quantity: quantity,
      image: item.image,
      emoji: item.emoji || '🍲',
    })

    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Orqa qoraytirish */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="pc-overlay"
        />

        {/* Modal oynasi (Katta ekranlarda Split-screen 2 ustunli) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative w-full max-w-4xl bg-white border border-[#EDE6DC] rounded-3xl overflow-hidden shadow-warm-2xl z-50 flex flex-col md:flex-row max-h-[92vh]"
        >
          {/* Yopish tugmasi */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer"
            aria-label="Yopish"
          >
            <X size={18} />
          </button>

          {/* ══════════════════════════════════════════════════
              1. CHAP USTUN: Taom rasmi, Kaloriya va Vaqt
          ══════════════════════════════════════════════════ */}
          <div className="md:w-1/2 relative bg-[#FAF7F2] overflow-hidden flex-shrink-0 min-h-[220px] md:min-h-full">
            {item.image && !imageError ? (
              <img
                src={item.image}
                alt={displayName}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                {item.emoji}
              </div>
            )}

            {/* Qoraytirish gradienti */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 md:bg-gradient-to-t md:from-black/80 md:via-transparent pointer-events-none" />

            {/* Holat yorlig'i */}
            {item.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D94E1F] text-white shadow-brand-sm">
                  <Flame size={12} className="fill-white" />
                  <span>{item.badge}</span>
                </span>
              </div>
            )}

            {/* Kaloriya (kcal) va Tayyorlanish vaqti */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center gap-2.5 text-white">
              {item.calories && (
                <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold flex items-center gap-1.5 border border-white/10">
                  <Flame size={14} className="text-[#E69D24]" />
                  <span>{item.calories} kcal</span>
                </div>
              )}
              {item.prepTime && (
                <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold flex items-center gap-1.5 border border-white/10">
                  <Clock size={14} className="text-[#D94E1F]" />
                  <span>{item.prepTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              2. O'NG USTUN: Tavsif, Porsiyalar, Qo'shimchalar
          ══════════════════════════════════════════════════ */}
          <div className="md:w-1/2 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[92vh]">
            <div className="p-6 sm:p-7 space-y-5">
              {/* Sarlavha va Kategoriya */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D94E1F]">
                  Plov City Oshxonasi
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F1A17] mt-0.5 leading-snug">
                  {displayName}
                </h2>
                <p className="text-xs sm:text-sm text-[#6B5E55] leading-relaxed mt-2">
                  {displayDesc}
                </p>
              </div>

              {/* 2. Porsiya / kg tanlash tugmalari (Osh turlari uchun) */}
              {item.variants && item.variants.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-[#EDE6DC]">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1F1A17] flex items-center gap-1.5">
                    <UtensilsCrossed size={14} className="text-[#D94E1F]" />
                    <span>Porsiya hajmini tanlang:</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {item.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id
                      const vName = v[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || v.weight
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#D94E1F] bg-[#FEF0EB] text-[#D94E1F] shadow-warm-xs'
                              : 'border-[#EDE6DC] bg-[#FAF7F2] text-[#6B5E55] hover:text-[#1F1A17]'
                          }`}
                        >
                          <div className="text-xs font-extrabold leading-tight">
                            {v.weight}
                          </div>
                          <div className="text-[11px] font-black text-[#E69D24] mt-1">
                            {formatPrice(v.price)}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 3. "Taomga qo'shimcha" (Optional Add-ons) chekboxlar ro'yxati */}
              <div className="space-y-2.5 pt-2 border-t border-[#EDE6DC]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1F1A17] flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#E69D24]" />
                    <span>Taomga qo‘shimcha masalliqlar:</span>
                  </label>
                  <span className="text-[11px] text-[#6B5E55]">ixtiyoriy</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                  {availableAddons.map((addon) => {
                    const isChecked = selectedAddons.some((a) => a.id === addon.id)
                    const addonName = addon.name[lang] || addon.name.uz

                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon)}
                        className={`flex items-center justify-between p-2.5 px-3 rounded-2xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'border-[#D94E1F] bg-[#FEF0EB]/60 text-[#1F1A17]'
                            : 'border-[#EDE6DC] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] text-[#6B5E55]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Chekbox kvadratchasi */}
                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-[#D94E1F] border-[#D94E1F] text-white'
                                : 'border-[#EDE6DC] bg-white'
                            }`}
                          >
                            {isChecked && <Check size={13} strokeWidth={3} />}
                          </div>
                          <span className="text-sm select-none">{addon.emoji}</span>
                          <span className="text-xs font-semibold text-[#1F1A17]">
                            {addonName}
                          </span>
                        </div>

                        <span className="text-xs font-extrabold text-[#D94E1F] whitespace-nowrap">
                          +{formatPrice(addon.price)} {t('units.currency')}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                4. PASTKI QISM: Miqdor tanlagich (- 1 +) va Katta Tugma
            ══════════════════════════════════════════════════ */}
            <div className="p-5 sm:p-6 bg-[#FAF7F2] border-t border-[#EDE6DC] flex flex-col sm:flex-row items-center gap-3.5 mt-auto">
              
              {/* Miqdor tanlagich (- 1 +) */}
              <div className="flex items-center gap-2 bg-white border border-[#EDE6DC] p-1.5 px-3 rounded-2xl shadow-warm-xs w-full sm:w-auto justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE6DC] text-[#1F1A17] flex items-center justify-center font-bold transition-colors active:scale-90 cursor-pointer"
                  aria-label="Kamaytirish"
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>
                <span className="font-extrabold text-[#1F1A17] text-base min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE6DC] text-[#1F1A17] flex items-center justify-center font-bold transition-colors active:scale-90 cursor-pointer"
                  aria-label="Ko'paytirish"
                >
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              </div>

              {/* Umumiy narxli Katta "Savatchaga qo'shish" tugmasi */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-primary btn-lg flex-1 w-full gap-2 justify-center shadow-brand-md cursor-pointer text-sm sm:text-base font-extrabold"
              >
                <ShoppingBag size={19} />
                <span>
                  {t('menu.addToCart')} — {formatPrice(finalTotalPrice)} {t('units.currency')}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
