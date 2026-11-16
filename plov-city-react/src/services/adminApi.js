import { menuItems as starterMenu } from '@data/menuData'

// Storage kalitlari
const MENU_STORAGE_KEY = 'plov_city_menu_v2'
const ORDERS_STORAGE_KEY = 'plov_city_orders_v2'
const VISITORS_STORAGE_KEY = 'plov_city_visitors_v2'
const AUTH_STORAGE_KEY = 'plov_city_admin_auth_v2'
const SESSION_STORAGE_KEY = 'plov_city_admin_session_v2'
const VISITOR_ID_KEY = 'plov_city_visitor_uuid'

// Old starter images may still be saved in a visitor's local menu. Replace
// only those untouched defaults so admin-selected images remain intact.
const LEGACY_DEFAULT_IMAGES = {
  'addon-qazi': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  'addon-quail-eggs': 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?auto=format&fit=crop&w=800&q=80',
  'addon-dolma': 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
  'addon-achichuk': 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80',
  'addon-suzma': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
  'salad-chicken-mushroom': 'https://images.unsplash.com/photo-1505253758473-96b3d58f7004?auto=format&fit=crop&w=800&q=80',
  'promo-family-set': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  'promo-friends-lunch': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  'promo-office-delivery': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
}

function refreshDefaultMenuImages(items) {
  return items.map((item) => {
    const oldImage = LEGACY_DEFAULT_IMAGES[item.id]
    const starterItem = starterMenu.find((candidate) => candidate.id === item.id)
    return oldImage && item.image === oldImage && starterItem
      ? { ...item, image: starterItem.image }
      : item
  })
}

// Birlamchi admin ma'lumotlari (faqat do'kon egasi uchun)
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'plovadmin2026', // Standart parol, admin panel ichida istalgan vaqtda o'zgartiriladi
  lastPasswordChange: new Date().toISOString(),
}

// Supabase konfiguratsiyasi (agar kiritilgan bo'lsa)
const supabaseConfig = window.PLOV_SUPABASE_CONFIG || {}

function hasSupabase() {
  return Boolean(supabaseConfig.url && supabaseConfig.anonKey && supabaseConfig.url !== 'https://YOUR_PROJECT.supabase.co')
}

// ─── VISITOR IDENTIFIER ───
export function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY)
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : `vis-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      localStorage.setItem(VISITOR_ID_KEY, id)
    }
    return id
  } catch {
    return 'anon-visitor'
  }
}

// ─── TASHRIFLARNI YOZIB BORISH (Saytga kirganlarni qayd qilish) ───
export async function recordVisit() {
  const visitorId = getVisitorId()
  const now = new Date().toISOString()

  try {
    const raw = localStorage.getItem(VISITORS_STORAGE_KEY)
    let visitors = raw ? JSON.parse(raw) : []

    const existingIndex = visitors.findIndex(v => v.id === visitorId)
    if (existingIndex >= 0) {
      visitors[existingIndex].lastVisit = now
      visitors[existingIndex].visitCount = (visitors[existingIndex].visitCount || 1) + 1
    } else {
      visitors.push({
        id: visitorId,
        firstVisit: now,
        lastVisit: now,
        visitCount: 1,
        hasOrdered: false,
      })
    }

    localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(visitors))
  } catch (err) {
    console.warn('Tashrifni qayd qilishda xatolik:', err)
  }

  // Agar Supabase ulangan bo'lsa, unga ham yuborish
  if (hasSupabase()) {
    try {
      await fetch(`${supabaseConfig.url.replace(/\/$/, '')}/rest/v1/rpc/record_visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseConfig.anonKey,
          Authorization: `Bearer ${supabaseConfig.anonKey}`,
        },
        body: JSON.stringify({ visitor: visitorId }),
      })
    } catch {
      // Supabase xatolik bersa ham local ishlashda davom etadi
    }
  }

  return { success: true }
}

// ─── BUYURTMALARNI YOZIB BORISH (Zakaz berganlarni qayd qilish) ───
export async function recordOrder(order) {
  const visitorId = getVisitorId()
  const now = new Date().toISOString()

  const completeOrder = {
    ...order,
    orderNumber: order.orderNumber || `PC-${Date.now().toString().slice(-6)}`,
    recordedAt: now,
    visitorId,
    status: order.status || 'new', // new, preparing, delivered, cancelled
  }

  try {
    // 1. Buyurtmalar ro'yxatiga qo'shish
    const rawOrders = localStorage.getItem(ORDERS_STORAGE_KEY)
    const orders = rawOrders ? JSON.parse(rawOrders) : []
    
    // Duplikatni oldini olish
    const filtered = orders.filter(o => o.orderNumber !== completeOrder.orderNumber)
    filtered.unshift(completeOrder)
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filtered))

    // 2. Ushbu tashrif buyuruvchini "buyurtma berdi" (hasOrdered: true) qilib belgilash
    const rawVisitors = localStorage.getItem(VISITORS_STORAGE_KEY)
    let visitors = rawVisitors ? JSON.parse(rawVisitors) : []
    const visitorIndex = visitors.findIndex(v => v.id === visitorId)
    if (visitorIndex >= 0) {
      visitors[visitorIndex].hasOrdered = true
      visitors[visitorIndex].orderCount = (visitors[visitorIndex].orderCount || 0) + 1
      visitors[visitorIndex].lastOrderAt = now
    } else {
      visitors.push({
        id: visitorId,
        firstVisit: now,
        lastVisit: now,
        visitCount: 1,
        hasOrdered: true,
        orderCount: 1,
        lastOrderAt: now,
      })
    }
    localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(visitors))
  } catch (err) {
    console.warn('Buyurtmani saqlashda xatolik:', err)
  }

  // Supabase integratsiyasi
  if (hasSupabase()) {
    try {
      await fetch(`${supabaseConfig.url.replace(/\/$/, '')}/rest/v1/rpc/record_order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseConfig.anonKey,
          Authorization: `Bearer ${supabaseConfig.anonKey}`,
        },
        body: JSON.stringify({ payload: completeOrder, visitor: visitorId }),
      })
    } catch {
      // offline fallback
    }
  }

  return { success: true, order: completeOrder }
}

// ─── MENYU MA'LUMOTLARINI OLISH ───
export async function getMenu() {
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const refreshed = refreshDefaultMenuImages(parsed)
        if (JSON.stringify(refreshed) !== JSON.stringify(parsed)) {
          localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(refreshed))
        }
        return refreshed
      }
    }
  } catch (err) {
    console.warn('Mahalliy menyuni o‘qishda xatolik:', err)
  }

  // Agar Supabase mavjud bo'lsa, undan yuklashga urinib ko'rish
  if (hasSupabase()) {
    try {
      const res = await fetch(`${supabaseConfig.url.replace(/\/$/, '')}/rest/v1/menu_items?select=item&order=position.asc`, {
        headers: {
          apikey: supabaseConfig.anonKey,
          Authorization: `Bearer ${supabaseConfig.anonKey}`,
        },
      })
      if (res.ok) {
        const rows = await res.json()
        if (Array.isArray(rows) && rows.length > 0) {
          const items = refreshDefaultMenuImages(rows.map(r => r.item))
          localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items))
          return items
        }
      }
    } catch {
      // fallback
    }
  }

  // Agar hali saqlanmagan bo'lsa, starterMenu'ni saqlab qo'yamiz
  try {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(starterMenu))
  } catch {}
  return starterMenu
}

// ─── MENYUNI SAQLASH ───
export async function saveMenu(menu) {
  if (!Array.isArray(menu)) throw new Error('Menyu ro‘yxat bo‘lishi lozim')

  try {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu))
    window.dispatchEvent(new CustomEvent('plov-menu-updated', { detail: menu }))
  } catch (err) {
    throw new Error('Mahalliy xotiraga saqlab bo‘lmadi: ' + err.message)
  }

  if (hasSupabase()) {
    try {
      const token = getSessionToken()
      await fetch(`${supabaseConfig.url.replace(/\/$/, '')}/rest/v1/rpc/save_menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseConfig.anonKey,
          Authorization: `Bearer ${token || supabaseConfig.anonKey}`,
        },
        body: JSON.stringify({ items: menu }),
      })
    } catch (err) {
      console.warn('Supabase menyu saqlash xatoligi:', err)
    }
  }

  return { success: true, count: menu.length }
}

// ─── ADMIN STATISTIKASI VA MA'LUMOTLARI ───
export async function getAdminData() {
  const menu = await getMenu()

  let orders = []
  try {
    const rawOrders = localStorage.getItem(ORDERS_STORAGE_KEY)
    orders = rawOrders ? JSON.parse(rawOrders) : []
  } catch {
    orders = []
  }

  let visitors = []
  try {
    const rawVisitors = localStorage.getItem(VISITORS_STORAGE_KEY)
    visitors = rawVisitors ? JSON.parse(rawVisitors) : []
  } catch {
    visitors = []
  }

  // Statistikalarni hisoblash
  const totalVisitorsCount = visitors.length
  // Haqiqatda zakaz bergan unikal foydalanuvchilar soni
  const orderedVisitorsCount = visitors.filter(v => v.hasOrdered).length
  // Kirib shunchaki chiqqanlar soni (hech qanday zakaz bermaganlar)
  const browsingOnlyCount = Math.max(0, totalVisitorsCount - orderedVisitorsCount)
  // Jami buyurtmalar soni
  const totalOrdersCount = orders.length
  // Jami tushum
  const totalRevenue = orders.reduce((sum, o) => {
    if (o.status === 'cancelled') return sum
    return sum + (Number(o.totalPrice) || 0)
  }, 0)

  // Konversiya foizi (zakaz berganlar / jami kirganlar)
  const conversionRate = totalVisitorsCount > 0
    ? ((orderedVisitorsCount / totalVisitorsCount) * 100).toFixed(1)
    : '0.0'

  const stats = {
    visitors: totalVisitorsCount,
    orderedVisitors: orderedVisitorsCount,
    browsingOnly: browsingOnlyCount,
    orders: totalOrdersCount,
    totalRevenue,
    conversionRate,
  }

  return {
    menu,
    orders,
    stats,
  }
}

// ─── BUYURTMANI O'CHIRISH ───
export async function removeOrder(orderNumber) {
  try {
    const rawOrders = localStorage.getItem(ORDERS_STORAGE_KEY)
    let orders = rawOrders ? JSON.parse(rawOrders) : []
    const filtered = orders.filter(o => o.orderNumber !== orderNumber)
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filtered))
    return { success: true }
  } catch (err) {
    throw new Error('Buyurtmani o‘chirishda xatolik: ' + err.message)
  }
}

// ─── BUYURTMA STATUSINI O'ZGARTIRISH ───
export async function updateOrderStatus(orderNumber, newStatus) {
  try {
    const rawOrders = localStorage.getItem(ORDERS_STORAGE_KEY)
    let orders = rawOrders ? JSON.parse(rawOrders) : []
    const index = orders.findIndex(o => o.orderNumber === orderNumber)
    if (index >= 0) {
      orders[index].status = newStatus
      orders[index].updatedAt = new Date().toISOString()
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
      return { success: true, order: orders[index] }
    }
    throw new Error('Buyurtma topilmadi')
  } catch (err) {
    throw new Error('Statusni o‘zgartirishda xatolik: ' + err.message)
  }
}

// ─── RASMNI SIQISH VA SAQLASH (Client-side Canvas Image Optimizer) ───
export async function uploadMenuImage(fileOrDataUrl) {
  if (!fileOrDataUrl) return ''

  // Agar allaqachon URL bo'lsa (https://...)
  if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('http')) {
    return fileOrDataUrl
  }

  // Agar dataURL bo'lsa, qaytarish
  if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
    return fileOrDataUrl
  }

  // Agar File obyekti bo'lsa, Canvas orqali optimal hajmga keltirib DataURL yasaymiz
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Faylni o‘qib bo‘lmadi'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Rasm formati noto‘g‘ri'))
      img.onload = () => {
        const maxWidth = 1000
        const maxHeight = 1000
        let { width, height } = img

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // WebP yoki JPEG siqilgan format
        const optimizedUrl = canvas.toDataURL('image/jpeg', 0.85)
        resolve(optimizedUrl)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(fileOrDataUrl)
  })
}

// ─── ADMIN XAVFSIZLIGI VA AUTENTIFIKATSIYA ───
// "admin panel manga berilsin boshqalarga berilmasin"

function getStoredAdminAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_ADMIN
}

function getSessionToken() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (raw) {
      const session = JSON.parse(raw)
      return session?.token || session?.access_token || null
    }
  } catch {}
  return null
}

export async function getAdminSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return false
    const session = JSON.parse(raw)
    // Sessiya mavjud va yaroqli
    if (session && session.token && session.authenticated) {
      return true
    }
    return false
  } catch {
    return false
  }
}

export async function adminLogin(identifier, password) {
  const trimmedId = (identifier || '').trim().toLowerCase()
  const trimmedPass = (password || '').trim()

  const adminAuth = getStoredAdminAuth()
  const storedUser = adminAuth.username.toLowerCase()

  // 1. Standart/Mahalliy admin tekshiruvi
  const isValidIdentifier = trimmedId === storedUser || trimmedId === 'admin' || trimmedId === 'admin@plovcity.uz' || trimmedId === 'owner'
  const isValidPassword = trimmedPass === adminAuth.password

  if (isValidIdentifier && isValidPassword) {
    const session = {
      token: `plov-session-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      user: adminAuth.username,
      authenticated: true,
      loginAt: new Date().toISOString(),
    }
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    return { success: true, session }
  }

  // 2. Agar Supabase ulangan bo'lsa, Supabase Auth orqali ham urinib ko'rish
  if (hasSupabase()) {
    try {
      const response = await fetch(`${supabaseConfig.url.replace(/\/$/, '')}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseConfig.anonKey,
        },
        body: JSON.stringify({ email: identifier, password }),
      })
      const result = await response.json()
      if (response.ok && result.access_token) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
          token: result.access_token,
          user: result.user?.email || 'admin',
          authenticated: true,
          loginAt: new Date().toISOString(),
        }))
        return { success: true, session: result }
      }
    } catch {
      // fallback to error
    }
  }

  throw new Error('Noto‘g‘ri login yoki parol. Admin panel faqat do‘kon egasiga tegishli.')
}

export async function adminLogout() {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {}
  return { success: true }
}

// ─── ADMIN PAROLINI O'ZGARTIRISH ───
// Egasi o'ziga yangi maxfiy parol o'rnatishi uchun
export async function changeAdminPassword({ currentPassword, newPassword, newUsername }) {
  const currentAuth = getStoredAdminAuth()

  if (currentPassword !== currentAuth.password) {
    throw new Error('Joriy parol noto‘g‘ri kiritildi!')
  }

  if (!newPassword || newPassword.length < 5) {
    throw new Error('Yangi parol kamida 5 ta belgidan iborat bo‘lishi kerak.')
  }

  const updatedAuth = {
    username: newUsername && newUsername.trim() ? newUsername.trim() : currentAuth.username,
    password: newPassword.trim(),
    lastPasswordChange: new Date().toISOString(),
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedAuth))
  return { success: true, username: updatedAuth.username }
}

export function getAdminAccountInfo() {
  const auth = getStoredAdminAuth()
  return {
    username: auth.username,
    lastPasswordChange: auth.lastPasswordChange,
  }
}
