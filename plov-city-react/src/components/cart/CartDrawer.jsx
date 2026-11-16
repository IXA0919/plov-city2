import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck, Sparkles, PlusCircle } from 'lucide-react'
import { useCart } from '@context/CartContext'
import { useLanguage } from '@context/LanguageContext'
import { formatPrice } from '@utils'
import CheckoutModal from './CheckoutModal'
import OrderSuccessModal from './OrderSuccessModal'

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    subtotal,
    deliveryFee,
    total,
    totalItems,
    isFreeDelivery,
    amountToFreeDelivery,
    freeDeliveryProgress,
    increment,
    decrement,
    removeItem,
    clearCart,
    addItem,
  } = useCart()

  const { t, lang } = useLanguage()

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [successOrderNumber, setSuccessOrderNumber] = useState(null)

  // 4. "Buyurtmaga qo'shimcha tavsiyalar" (Upsell items - 1 bosishda qo'shiladi)
  const upsellRecommendations = [
    {
      id: 'addon-non',
      name: { uz: 'Issiq tandir non (patir)', ru: 'Тандырная лепёшка (патир)', en: 'Tandoor Flatbread (Patyr)' },
      price: 6000,
      emoji: '🫓',
      weight: '300g',
      image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'drink-green-tea',
      name: { uz: 'Limonli ko‘k choy (choynak)', ru: 'Зелёный чай с лимоном', en: 'Lemon Green Tea (teapot)' },
      price: 12000,
      emoji: '🫖',
      weight: '800ml',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'addon-achichuk',
      name: { uz: 'Achichuk pomidor salati', ru: 'Салат Ачик-чучук', en: 'Achichuk Tomato Salad' },
      price: 10000,
      emoji: '🍅',
      weight: '150g',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'drink-ayran',
      name: { uz: 'Muzdek uy ayroni', ru: 'Домашний айран с мятой', en: 'Chilled Homemade Ayran' },
      price: 12000,
      emoji: '🥛',
      weight: '0.5L',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
    },
  ]

  // Upsell mahsulotini qo'shish
  const handleAddUpsell = (upsell) => {
    const upsellName = upsell.name[lang] || upsell.name.uz
    addItem({
      id: upsell.id,
      name: upsell.name,
      nameUz: upsellName,
      price: upsell.price,
      weight: upsell.weight,
      emoji: upsell.emoji,
      image: upsell.image,
    })
  }

  const handleStartCheckout = () => {
    closeCart()
    setIsCheckoutOpen(true)
  }

  const handleOrderSuccess = (orderNumber) => {
    setSuccessOrderNumber(orderNumber)
  }

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* ══════════════════════════════════════════════════
                1. ORQA FON QORAYTIRILGAN (bg-black/50 backdrop-blur-sm)
            ══════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
              onClick={closeCart}
            />

            {/* ══════════════════════════════════════════════════
                O'NG TOMONDAN SILLIQ SIRPANIB CHIQADIGAN PANEL
            ══════════════════════════════════════════════════ */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 290 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-warm-2xl flex flex-col border-l border-[#EDE6DC]"
            >
              {/* Header: Sarlavha, Mahsulotlar soni va Yopish */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE6DC] bg-[#FAF7F2]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#D94E1F]/10 flex items-center justify-center text-[#D94E1F]">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <span className="font-extrabold text-[#1F1A17] text-base">
                      {t('cart.title')}
                    </span>
                    {totalItems > 0 && (
                      <span className="text-xs text-[#6B5E55] block -mt-0.5 font-medium">
                        {t('cart.itemsCount', { count: totalItems })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      title={t('cart.clearCart')}
                      className="w-8 h-8 rounded-full hover:bg-red-50 text-[#6B5E55] hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={closeCart}
                    className="w-8 h-8 rounded-full hover:bg-[#EDE6DC] text-[#1F1A17] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Yopish"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* ══════════════════════════════════════════════════
                  2. BEPUL YETKAZIB BERISH PROGRESS-BARI (150 000 so'm)
              ══════════════════════════════════════════════════ */}
              {items.length > 0 && (
                <div className="bg-[#FAF7F2] px-6 py-3.5 border-b border-[#EDE6DC]">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Truck size={15} className={isFreeDelivery ? 'text-emerald-700' : 'text-[#D94E1F]'} />
                      {isFreeDelivery ? (
                        <span className="text-emerald-800 font-extrabold flex items-center gap-1">
                          <Sparkles size={13} className="text-emerald-700" />
                          Tabriklaymiz! Yetkazib berish bepul! 🎉
                        </span>
                      ) : (
                        <span className="text-[#1F1A17]">
                          Yana <strong className="text-[#D94E1F]">{formatPrice(amountToFreeDelivery)} {t('units.currency')}</strong> buyurtma bering va yetkazib berish <strong className="text-emerald-800">BEPUL</strong> bo‘ladi!
                        </span>
                      )}
                    </span>
                    <span className="text-[#6B5E55] text-[11px] font-mono">{freeDeliveryProgress}%</span>
                  </div>

                  {/* Progress chiziqchasi */}
                  <div className="w-full h-2 bg-[#EDE6DC] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-400 rounded-full ${
                        isFreeDelivery
                          ? 'bg-emerald-600'
                          : 'bg-gradient-to-r from-[#D94E1F] via-[#E85820] to-[#E69D24]'
                      }`}
                      style={{ width: `${freeDeliveryProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  3. MAHSULOTLAR RO'YXATI
              ══════════════════════════════════════════════════ */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-[#FAF7F2] flex items-center justify-center text-4xl mb-1 shadow-inner-warm">
                      🍲
                    </div>
                    <p className="font-extrabold text-[#1F1A17] text-lg">
                      {t('cart.empty')}
                    </p>
                    <p className="text-xs text-[#6B5E55] max-w-xs leading-relaxed">
                      {t('cart.emptyHint')}
                    </p>
                    <button
                      onClick={closeCart}
                      className="btn-primary btn-sm mt-3 shadow-brand-sm"
                    >
                      {t('nav.menu')}
                    </button>
                  </div>
                ) : (
                  items.map((item) => {
                    const itemName = item.name?.[lang] || item.nameUz || item.name?.uz || 'Osh'
                    const itemPrice = item.unitPrice || item.price || 0
                    const itemTotalPrice = itemPrice * item.quantity

                    return (
                      <div
                        key={item.cartItemId}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#EDE6DC] shadow-warm-xs group hover:border-[#D94E1F]/30 transition-all"
                      >
                        {/* Kichik rasm */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex items-center justify-center text-3xl flex-shrink-0 border border-[#EDE6DC] shadow-warm-xs">
                          {item.image ? (
                            <img src={item.image} alt={itemName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{item.emoji || '🍲'}</span>
                          )}
                        </div>

                        {/* Nomi, porsiyasi va narxi */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-[#1F1A17] truncate leading-tight">
                            {itemName}
                          </h4>

                          {/* Tanlangan porsiya (masalan: 0.5 kg + Qazi) */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            {item.weight && (
                              <span className="text-[10px] font-bold text-[#D94E1F] bg-[#FEF0EB] px-1.5 py-0.5 rounded-md">
                                {item.weight}
                              </span>
                            )}
                          </div>

                          <div className="text-xs font-black text-[#E69D24] mt-1">
                            {formatPrice(itemTotalPrice)} {t('units.currency')}
                          </div>
                        </div>

                        {/* - 1 + tugmalari */}
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#EDE6DC] shadow-warm-xs">
                          <button
                            type="button"
                            onClick={() => decrement(item.cartItemId)}
                            className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-[#D94E1F] hover:text-white text-[#1F1A17] flex items-center justify-center text-xs font-bold transition-colors active:scale-90 cursor-pointer"
                            aria-label="Kamaytirish"
                          >
                            <Minus size={11} strokeWidth={3} />
                          </button>

                          <span className="w-5 text-center font-extrabold text-xs text-[#1F1A17]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => increment(item.cartItemId)}
                            className="w-6 h-6 rounded-lg bg-[#D94E1F] text-white hover:bg-[#B83D14] flex items-center justify-center text-xs font-bold transition-colors active:scale-90 cursor-pointer shadow-brand-sm"
                            aria-label="Ko'paytirish"
                          >
                            <Plus size={11} strokeWidth={3} />
                          </button>
                        </div>

                        {/* O'chirish (axlat qutisi) tugmasi */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.cartItemId)}
                          className="p-1.5 text-[#6B5E55] hover:text-red-600 transition-colors cursor-pointer"
                          title={t('cart.remove')}
                          aria-label={t('cart.remove')}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )
                  })
                )}

                {/* ══════════════════════════════════════════════════
                    4. "BUYURTMAGA QO'SHIMCHA TAVSIYALAR" (UPSELL)
                ══════════════════════════════════════════════════ */}
                {items.length > 0 && (
                  <div className="pt-3 border-t border-[#EDE6DC]">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#1F1A17] flex items-center gap-1.5">
                        <Sparkles size={13} className="text-[#E69D24]" />
                        <span>Qo‘shimcha tavsiyalar:</span>
                      </span>
                      <span className="text-[10px] text-[#6B5E55]">1 bosishda qo‘shing</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {upsellRecommendations.map((upsell) => {
                        const upName = upsell.name[lang] || upsell.name.uz
                        return (
                          <div
                            key={upsell.id}
                            className="p-2.5 rounded-2xl bg-white border border-[#EDE6DC] hover:border-[#D94E1F]/40 shadow-warm-xs flex items-center justify-between gap-2 transition-all group"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-lg flex-shrink-0 select-none">{upsell.emoji}</span>
                              <div className="min-w-0">
                                <div className="text-[11px] font-bold text-[#1F1A17] truncate leading-tight">
                                  {upName}
                                </div>
                                <div className="text-[10px] font-extrabold text-[#E69D24]">
                                  +{formatPrice(upsell.price)}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddUpsell(upsell)}
                              className="w-7 h-7 rounded-xl bg-[#FAF7F2] hover:bg-[#D94E1F] text-[#D94E1F] hover:text-white flex items-center justify-center transition-colors flex-shrink-0 shadow-warm-xs cursor-pointer active:scale-90"
                              title="Qo'shish"
                              aria-label="Qo'shish"
                            >
                              <Plus size={14} strokeWidth={2.5} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ══════════════════════════════════════════════════
                  5. ENG PASTDA: HISOB-KITOB VA RASMIYLASHTIRISH
              ══════════════════════════════════════════════════ */}
              {items.length > 0 && (
                <div className="border-t border-[#EDE6DC] p-5 space-y-3 bg-[#FAF7F2] shadow-warm-md">
                  <div className="space-y-1.5 text-xs sm:text-sm">
                    {/* Mahsulotlar narxi */}
                    <div className="flex justify-between items-center text-[#6B5E55]">
                      <span>{t('cart.subtotal')}:</span>
                      <span className="font-bold text-[#1F1A17]">{formatPrice(subtotal)} {t('units.currency')}</span>
                    </div>

                    {/* Yetkazib berish narxi */}
                    <div className="flex justify-between items-center text-[#6B5E55]">
                      <span>{t('cart.delivery')}:</span>
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                          <Sparkles size={12} />
                          {t('cart.free')}
                        </span>
                      ) : (
                        <span className="font-bold text-[#1F1A17]">
                          {formatPrice(deliveryFee)} {t('units.currency')}
                        </span>
                      )}
                    </div>

                    <div className="h-px bg-[#EDE6DC] my-1" />

                    {/* Jami summa */}
                    <div className="flex justify-between items-center pt-0.5">
                      <span className="text-sm sm:text-base font-extrabold text-[#1F1A17]">{t('cart.total')}:</span>
                      <span className="font-black text-xl sm:text-2xl text-[#E69D24] leading-none">
                        {formatPrice(total)} {t('units.currency')}
                      </span>
                    </div>
                  </div>

                  {/* "Buyurtmani rasmiylashtirish" tugmasi */}
                  <button
                    onClick={handleStartCheckout}
                    className="btn-primary w-full btn-lg gap-2 justify-center shadow-brand-md text-sm sm:text-base font-extrabold active:scale-95 cursor-pointer"
                  >
                    <span>{t('cart.orderBtn')}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Form Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleOrderSuccess}
      />

      {/* Muvaffaqiyatli buyurtma modali */}
      <OrderSuccessModal
        isOpen={Boolean(successOrderNumber)}
        onClose={() => setSuccessOrderNumber(null)}
        orderNumber={successOrderNumber}
      />
    </>
  )
}
