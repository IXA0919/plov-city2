import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CartProvider } from '@context/CartContext'
import { LanguageProvider } from '@context/LanguageContext'
import Navbar from '@components/layout/Navbar'
import Footer from '@components/layout/Footer'
import Hero from '@components/home/Hero'
import Promotions from '@components/home/Promotions'
import AboutSection from '@components/home/AboutSection'
import Branches from '@components/home/Branches'
import MenuSection from '@components/menu/MenuSection'
import CartDrawer from '@components/cart/CartDrawer'
import AdminPanel from '@components/admin/AdminPanel'
import { recordVisit } from '@services/adminApi'

// Yengil va silliq Fade-in-up animatsiya konfiguratsiyasi
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

function checkIsAdmin() {
  const path = window.location.pathname.replace(/\/$/, '')
  const hash = window.location.hash
  const search = window.location.search
  return path === '/admin' || hash === '#admin' || hash === '#/admin' || search.includes('admin=true')
}

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(checkIsAdmin)

  useEffect(() => {
    const handleRoute = () => setIsAdminRoute(checkIsAdmin())
    const handleKeyDown = (e) => {
      // Ctrl + Shift + A (Admin hotkey - faqat egasi uchun tezkor kirish)
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault()
        if (window.location.pathname.replace(/\/$/, '') === '/admin') {
          window.location.href = '/'
        } else {
          window.location.hash = '#admin'
        }
      }
    }

    window.addEventListener('popstate', handleRoute)
    window.addEventListener('hashchange', handleRoute)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('popstate', handleRoute)
      window.removeEventListener('hashchange', handleRoute)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (!isAdminRoute) {
      recordVisit().catch(() => {})
    }
  }, [isAdminRoute])

  if (isAdminRoute) return <AdminPanel />

  return (
    <LanguageProvider>
      <CartProvider>
        <div className="min-h-screen bg-cream-100 text-ink overflow-x-hidden selection:bg-brand selection:text-white flex flex-col justify-between">
          
          {/* Sahifa tepasidagi navigatsiya */}
          <Navbar />

          {/* Asosiy kontent oqimi */}
          <main className="flex-1 w-full overflow-x-hidden">
            {/* 1. Hero bo'limi */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeInUpVariants}
            >
              <Hero />
            </motion.section>

            {/* 2. Aksiyalar va Maxsus Kombolar */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeInUpVariants}
            >
              <Promotions />
            </motion.section>

            {/* 3. Boy Menyu (Oshlar, Qo'shimchalar, Salatlar, Ichimliklar) */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              variants={fadeInUpVariants}
            >
              <MenuSection />
            </motion.section>

            {/* 4. "Nega aynan Plov City?" — 4 ta ustunlik va ishonch ko'rsatkichlari */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeInUpVariants}
            >
              <AboutSection />
            </motion.section>

            {/* 5. Toshkentdagi 3 ta filial va interaktiv xarita paneli */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              variants={fadeInUpVariants}
            >
              <Branches />
            </motion.section>
          </main>

          {/* To'q shokolad rangli hashamatli Footer */}
          <Footer />

          {/* Savatcha (Slide-in Drawer) & Checkout & Success modallari */}
          <CartDrawer />
          
        </div>
      </CartProvider>
    </LanguageProvider>
  )
}
