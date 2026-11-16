import { useEffect, useRef, useState } from 'react'

/**
 * useIntersectionObserver — element ko'rinishini kuzatuvchi
 * @param {object} options - IntersectionObserver options
 * @returns {{ ref, isIntersecting }}
 */
export function useIntersectionObserver(options = {}) {
  const ref = useRef(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, isIntersecting }
}

/**
 * useScrollSpy — aktiv section id ni aniqlaydi
 * @param {string[]} sectionIds
 * @param {number} offset - navbar height offset
 * @returns {string} activeId
 */
export function useScrollSpy(sectionIds, offset = 80) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + offset + 20
      let found = sectionIds[0]

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollY) {
          found = id
        }
      }

      setActiveId(found)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [sectionIds, offset])

  return activeId
}

/**
 * useDebounce — qiymatni debounce qiladi
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

/**
 * useLocalStorage — localStorage bilan bog'liq state
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch { return initialValue }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {}
  }

  return [storedValue, setValue]
}

/**
 * useBodyScrollLock — modal ochiq bo'lganda scroll ni bloklaydi
 */
export function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (isLocked) {
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top      = `-${scrollY}px`
      document.body.style.width    = '100%'
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top      = ''
      document.body.style.width    = ''
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
  }, [isLocked])
}

/**
 * useMediaQuery
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}

