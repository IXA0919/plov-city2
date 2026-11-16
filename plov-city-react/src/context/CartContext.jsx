import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'

/* ─── Konstantalar ─── */
const CART_STORAGE_KEY = 'plov_city_cart'
const FREE_DELIVERY_THRESHOLD = 150000 // 150 000 so'm va undan yuqori bepul
const STANDARD_DELIVERY_FEE = 15000     // 15 000 so'm standart yetkazib berish

/* ─── Dastlabki holat ─── */
const getInitialCart = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.warn('localStorage dan savatni yuklashda xatolik:', e)
  }
  return []
}

const initialState = {
  items: getInitialCart(),
  isCartOpen: false,
  orderNote: '',
}

/* ─── Action turlari ─── */
const ACTIONS = {
  ADD_ITEM:      'ADD_ITEM',
  REMOVE_ITEM:   'REMOVE_ITEM',
  INCREMENT:     'INCREMENT',
  DECREMENT:     'DECREMENT',
  CLEAR_CART:    'CLEAR_CART',
  TOGGLE_CART:   'TOGGLE_CART',
  OPEN_CART:     'OPEN_CART',
  CLOSE_CART:    'CLOSE_CART',
  SET_NOTE:      'SET_NOTE',
}

/**
 * Har bir savat qatori uchun unikal kalit yasovchi yordamchi funksiya:
 * Mahsulot ID + Variant ID + Tanlangan qo'shimchalar ID lari
 */
export function generateCartItemId(item) {
  const baseId = item.id
  const variantId = item.selectedVariant?.id || item.variantId || 'standard'
  const addonsIds = Array.isArray(item.selectedAddons)
    ? item.selectedAddons.map(a => a.id).sort().join('_')
    : ''
  return `${baseId}_v:${variantId}${addonsIds ? `_a:${addonsIds}` : ''}`
}

/* ─── Reducer ─── */
function cartReducer(state, action) {
  switch (action.type) {

    /* 1. Mahsulot qo'shish */
    case ACTIONS.ADD_ITEM: {
      const rawItem = action.payload
      const cartItemId = rawItem.cartItemId || generateCartItemId(rawItem)

      // Narx hisoblash: variant narxi (yoki asosiy narx) + qo'shimchalar narxi
      const basePrice = rawItem.selectedVariant?.price ?? rawItem.price ?? 0
      const addonsPrice = Array.isArray(rawItem.selectedAddons)
        ? rawItem.selectedAddons.reduce((sum, a) => sum + (a.price || 0), 0)
        : 0
      const unitPrice = basePrice + addonsPrice

      const existingIndex = state.items.findIndex(i => i.cartItemId === cartItemId)

      if (existingIndex > -1) {
        // Agar bir xil mahsulot va variant allaqachon bo'lsa, sonini oshirish
        const updatedItems = state.items.map((item, idx) => {
          if (idx === existingIndex) {
            return {
              ...item,
              quantity: item.quantity + (rawItem.quantity || 1),
            }
          }
          return item
        })
        return { ...state, items: updatedItems }
      }

      // Yangi mahsulot sifatida qo'shish
      const newItem = {
        cartItemId,
        id: rawItem.id,
        name: rawItem.name,
        nameUz: rawItem.nameUz || rawItem.name?.uz || 'Osh',
        image: rawItem.image,
        emoji: rawItem.emoji || '🍲',
        weight: rawItem.selectedVariant?.weight || rawItem.weight,
        selectedVariant: rawItem.selectedVariant || null,
        selectedAddons: rawItem.selectedAddons || [],
        unitPrice,
        price: unitPrice, // orqaga moslik uchun
        quantity: rawItem.quantity || 1,
      }

      return {
        ...state,
        items: [...state.items, newItem],
      }
    }

    /* 2. Miqdorni 1 ga oshirish */
    case ACTIONS.INCREMENT: {
      const targetId = action.payload
      const updated = state.items.map(item => {
        if (item.cartItemId === targetId || item.id === targetId) {
          return { ...item, quantity: item.quantity + 1 }
        }
        return item
      })
      return { ...state, items: updated }
    }

    /* 3. Miqdorni 1 ga kamaytirish (1 dan kamaysa o'chirish) */
    case ACTIONS.DECREMENT: {
      const targetId = action.payload
      const existing = state.items.find(i => i.cartItemId === targetId || i.id === targetId)
      if (!existing) return state

      if (existing.quantity <= 1) {
        // Savatchadan butunlay olib tashlash
        return {
          ...state,
          items: state.items.filter(i => i.cartItemId !== targetId && i.id !== targetId),
        }
      }

      const updated = state.items.map(item => {
        if (item.cartItemId === targetId || item.id === targetId) {
          return { ...item, quantity: item.quantity - 1 }
        }
        return item
      })
      return { ...state, items: updated }
    }

    /* 4. Butunlay o'chirish */
    case ACTIONS.REMOVE_ITEM: {
      const targetId = action.payload
      return {
        ...state,
        items: state.items.filter(i => i.cartItemId !== targetId && i.id !== targetId),
      }
    }

    /* 5. Savatchani tozalash */
    case ACTIONS.CLEAR_CART:
      return { ...state, items: [], orderNote: '' }

    /* 6. Savatcha oyna holatlari */
    case ACTIONS.TOGGLE_CART:
      return { ...state, isCartOpen: !state.isCartOpen }

    case ACTIONS.OPEN_CART:
      return { ...state, isCartOpen: true }

    case ACTIONS.CLOSE_CART:
      return { ...state, isCartOpen: false }

    case ACTIONS.SET_NOTE:
      return { ...state, orderNote: action.payload }

    default:
      return state
  }
}

/* ─── Context ─── */
const CartContext = createContext(null)

/* ─── Provider ─── */
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // 4. Savatcha ma'lumotlarini localStorage ga saqlash
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
    } catch (e) {
      console.warn('localStorage ga savatni saqlashda xatolik:', e)
    }
  }, [state.items])

  /* — Funksiyalar — */
  const addItem = useCallback((item) => {
    dispatch({ type: ACTIONS.ADD_ITEM, payload: item })
  }, [])

  const removeItem = useCallback((cartItemIdOrId) => {
    dispatch({ type: ACTIONS.REMOVE_ITEM, payload: cartItemIdOrId })
  }, [])

  const increment = useCallback((cartItemIdOrId) => {
    dispatch({ type: ACTIONS.INCREMENT, payload: cartItemIdOrId })
  }, [])

  const decrement = useCallback((cartItemIdOrId) => {
    dispatch({ type: ACTIONS.DECREMENT, payload: cartItemIdOrId })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_CART })
  }, [])

  const toggleCart = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_CART })
  }, [])

  const openCart = useCallback(() => {
    dispatch({ type: ACTIONS.OPEN_CART })
  }, [])

  const closeCart = useCallback(() => {
    dispatch({ type: ACTIONS.CLOSE_CART })
  }, [])

  const setNote = useCallback((note) => {
    dispatch({ type: ACTIONS.SET_NOTE, payload: note })
  }, [])

  /* ─── 3. Hisob-kitob mantiqi ─── */
  // Jami mahsulotlar soni
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)

  // subtotal: barcha mahsulotlarning umumiy narxi
  const subtotal = state.items.reduce((sum, item) => {
    const price = item.unitPrice ?? item.price ?? 0
    return sum + (price * item.quantity)
  }, 0)

  // deliveryFee: agar subtotal >= 150000 bo'lsa 0 so'm (Bepul), aks holda 15000 so'm
  // Agar savat bo'sh bo'lsa deliveryFee ham 0
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD
  const deliveryFee = subtotal === 0 ? 0 : (isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE)

  // total: subtotal + deliveryFee
  const total = subtotal + deliveryFee

  // Bepul yetkazib berishga qancha qolgani (foydalanuvchiga rag'batlantiruvchi xabar uchun)
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100))

  // Muayyan mahsulotning savatdagi sonini olish
  const getItemQuantity = useCallback((cartItemIdOrId) => {
    const item = state.items.find(i => i.cartItemId === cartItemIdOrId || i.id === cartItemIdOrId)
    return item ? item.quantity : 0
  }, [state.items])

  const isInCart = useCallback((cartItemIdOrId) => {
    return state.items.some(i => i.cartItemId === cartItemIdOrId || i.id === cartItemIdOrId)
  }, [state.items])

  const value = {
    items: state.items,
    isCartOpen: state.isCartOpen,
    isOpen: state.isCartOpen, // orqaga moslik uchun
    orderNote: state.orderNote,

    // Hisob-kitoblar
    totalItems,
    subtotal,
    deliveryFee,
    total,
    totalPrice: total, // orqaga moslik uchun
    isFreeDelivery,
    amountToFreeDelivery,
    freeDeliveryProgress,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,

    // Funksiyalar
    addItem,
    removeItem,
    increment,
    decrement,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    openDrawer: openCart,   // orqaga moslik uchun
    closeDrawer: closeCart, // orqaga moslik uchun
    toggleDrawer: toggleCart,
    setNote,
    getItemQuantity,
    itemCount: getItemQuantity,
    isInCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

/* ─── Hook ─── */
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart hooki faqat CartProvider ichida ishlatilishi kerak!')
  }
  return context
}

export default CartContext
