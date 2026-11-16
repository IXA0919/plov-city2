import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * cn — clsx + tailwind-merge
 * @example cn('px-4 py-2', isActive && 'bg-primary-700', 'text-white')
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Narxni "55 000 so'm" formatiga o'tkazish
 */
export function formatPrice(price, withCurrency = false) {
  const formatted = new Intl.NumberFormat('uz-UZ').format(price)
  return withCurrency ? `${formatted} so'm` : formatted
}

/**
 * Debounce
 */
export function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Local storage helper
 */
export const storage = {
  get: (key, fallback = null) => {
    try {
      const val = localStorage.getItem(key)
      return val ? JSON.parse(val) : fallback
    } catch { return fallback }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  },
  remove: (key) => { try { localStorage.removeItem(key) } catch {} },
}

/**
 * Sleep (async delay)
 */
export const sleep = (ms) => new Promise(r => setTimeout(r, ms))

/**
 * Clamp a number between min and max
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

/**
 * Scroll to element by id
 */
export function scrollToId(id, offset = 72) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}

