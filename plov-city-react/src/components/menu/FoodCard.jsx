import { useState } from 'react'
import { Plus, Minus, Eye, Flame, ShoppingBag, Sparkles } from 'lucide-react'
import { useCart, generateCartItemId } from '@context/CartContext'
import { useLanguage } from '@context/LanguageContext'
import { formatPrice } from '@utils'

export default function FoodCard({ item, onSelect }) {
  const { items, addItem, increment, decrement } = useCart()
  const { lang, t } = useLanguage()
  const [imageError, setImageError] = useState(false)

  // 3. Agar taomda porsiyalar (variants) bo'lsa dastlab birinchisi tanlanadi
  const [selectedVariant, setSelectedVariant] = useState(
    item.variants && item.variants.length > 0 ? item.variants[0] : null
  )

  // Ko'p tilli nom va tavsif
  const displayName = item.name?.[lang] || item.nameUz || item.name?.uz || 'Osh'
  const displayDesc = item.description?.[lang] || item.descUz || item.description?.uz || ''

  // Joriy variant bo'yicha dinamik narx va vazn
  const currentPrice = selectedVariant ? selectedVariant.price : item.price
  const currentWeight = selectedVariant
    ? (selectedVariant[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || selectedVariant.nameUz || selectedVariant.weight)
    : item.weight

  // 4. Aynan shu taom va joriy tanlangan variant uchun maxsus cartItemId
  const currentCartItemId = generateCartItemId({
    id: item.id,
    selectedVariant: selectedVariant,
  })

  // Savatchada bormi va soni nechta?
  const inCartItem = items.find(i => i.cartItemId === currentCartItemId)
  const quantity = inCartItem?.quantity || 0

  // Savatchaga qo'shish
  const handleAddToCart = (e) => {
    e.stopPropagation()
    addItem({
      id: item.id,
      cartItemId: currentCartItemId,
      name: item.name,
      nameUz: selectedVariant ? `${displayName} (${currentWeight})` : displayName,
      price: currentPrice,
      weight: currentWeight,
      selectedVariant: selectedVariant,
      emoji: item.emoji,
      image: item.image,
    })
  }

  // Miqdorni oshirish / kamaytirish
  const handleIncrement = (e) => {
    e.stopPropagation()
    increment(currentCartItemId)
  }

  const handleDecrement = (e) => {
    e.stopPropagation()
    decrement(currentCartItemId)
  }

  // Modal oynasini ochish
  const handleOpenModal = (e) => {
    e.stopPropagation()
    onSelect?.({
      ...item,
      initialVariant: selectedVariant,
    })
  }

  return (
    <div
      onClick={handleOpenModal}
      className="food-card flex flex-col justify-between group rounded-3xl bg-white border border-[#EDE6DC] overflow-hidden shadow-warm hover:shadow-warm-xl transition-all duration-300 cursor-pointer select-none"
    >
      {/* ══════════════════════════════════════════════════
          1. YUQORI QISMI: Rasm, Holat yorlig'i va Ko'zcha
      ══════════════════════════════════════════════════ */}
      <div className="relative aspect-food w-full overflow-hidden bg-[#FAF7F2]">
        {item.image && !imageError ? (
          <img
            src={item.image}
            alt={displayName}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {item.emoji}
          </div>
        )}

        {/* Nozik gradient qoraytirish */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

        {/* Chap yuqori burchak: Holat yorlig'i ("Xit", "Yangi", "-20%") */}
        {item.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            {item.badge === 'Xit' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#D94E1F] text-white shadow-brand-sm">
                <Flame size={12} className="fill-white" />
                <span>{item.badge}</span>
              </span>
            )}
            {item.badge.includes('%') && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#E69D24] text-white shadow-warm-xs">
                {item.badge}
              </span>
            )}
            {item.badge === 'Yangi' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-warm-xs">
                <Sparkles size={11} />
                <span>{t('badges.new')}</span>
              </span>
            )}
          </div>
        )}

        {/* O'ng yuqori burchak: Batafsil ko'rish (Ko'zcha ikonkasi) */}
        <button
          type="button"
          onClick={handleOpenModal}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#1F1A17] hover:text-[#D94E1F] backdrop-blur-md border border-[#EDE6DC]/80 shadow-warm-xs flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer"
          aria-label="Batafsil ko'rish"
          title="Batafsil ma'lumot"
        >
          <Eye size={15} strokeWidth={2.2} />
        </button>

        {/* Agar variants bo'lmasa o'ng pastki burchakda vazni */}
        {!item.variants && currentWeight && (
          <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded-lg bg-[#FAF7F2]/90 backdrop-blur-xs text-[11px] font-bold text-[#1F1A17] shadow-warm-xs">
            {currentWeight}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════
          2. O'RTA QISMI: Nomi va 2 qatorga sig'adigan tarkibi
      ══════════════════════════════════════════════════ */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#1F1A17] group-hover:text-[#D94E1F] transition-colors leading-snug line-clamp-1 mb-1">
            {displayName}
          </h3>
          <p className="text-xs text-[#6B5E55] line-clamp-2 leading-relaxed">
            {displayDesc}
          </p>
        </div>

        {/* ══════════════════════════════════════════════════
            3. OSH TURLARI UCHUN SEGMENTLI TUGMALAR (TABS)
            [1 porsiya] | [0.5 kg] | [1 kg]
        ══════════════════════════════════════════════════ */}
        {item.variants && item.variants.length > 0 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="p-1 bg-[#FAF7F2] border border-[#EDE6DC] rounded-xl flex items-center gap-1 shadow-inner-warm"
          >
            {item.variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id
              const tabLabel = v.weight || v.nameUz
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all duration-150 text-center cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#D94E1F] shadow-warm-xs border border-[#EDE6DC]/60'
                      : 'text-[#6B5E55] hover:text-[#1F1A17]'
                  }`}
                >
                  {tabLabel}
                </button>
              )
            })}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            4. PASTKI QISMI: Yirik narx va Savatcha tugmasi/Stepper
        ══════════════════════════════════════════════════ */}
        <div className="pt-2 border-t border-[#EDE6DC]/60 flex items-center justify-between gap-2">
          {/* Yirik va aniq dinamik narx */}
          <div>
            <div className="text-base sm:text-lg font-black text-[#E69D24] leading-none tracking-tight">
              {formatPrice(currentPrice)}
            </div>
            <div className="text-[10px] text-[#6B5E55] font-semibold mt-0.5">
              {t('units.currency')}
            </div>
          </div>

          {/* O'ng tomonda: Savatchaga qo'shish yoki Miqdor boshqaruvchisi */}
          {quantity === 0 ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#D94E1F] hover:bg-[#B83D14] text-white text-xs font-bold shadow-brand-sm hover:shadow-brand-md active:scale-95 transition-all duration-150 cursor-pointer"
              title={t('menu.addToCart')}
            >
              <Plus size={15} strokeWidth={2.8} />
              <span className="hidden xs:inline">{t('menu.addToCart')}</span>
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] border border-[#D94E1F]/30 rounded-xl shadow-warm-xs"
            >
              <button
                type="button"
                onClick={handleDecrement}
                className="w-7 h-7 rounded-lg bg-white border border-[#EDE6DC] text-[#D94E1F] hover:bg-[#D94E1F] hover:text-white flex items-center justify-center transition-colors active:scale-90 cursor-pointer"
                aria-label="Kamaytirish"
              >
                <Minus size={13} strokeWidth={3} />
              </button>

              <span className="w-5 text-center font-extrabold text-xs sm:text-sm text-[#1F1A17]">
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                className="w-7 h-7 rounded-lg bg-[#D94E1F] text-white hover:bg-[#B83D14] flex items-center justify-center transition-colors active:scale-90 cursor-pointer shadow-brand-sm"
                aria-label="Ko'paytirish"
              >
                <Plus size={13} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
