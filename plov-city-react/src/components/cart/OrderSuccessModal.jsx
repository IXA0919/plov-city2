import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Home } from 'lucide-react'
import { useLang } from '@context/LanguageContext'

export default function OrderSuccessModal({ isOpen, onClose, orderNumber }) {
  const { t } = useLang()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="pc-overlay"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-surface border border-surface-border rounded-3xl p-8 text-center shadow-warm-xl z-50 space-y-5"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-warm-xs">
            <CheckCircle2 size={44} />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-ink mb-1">
              {t('success.title')}
            </h3>
            <p className="text-sm text-muted">
              {t('success.subtitle')}
            </p>
          </div>

          {orderNumber && (
            <div className="p-3 bg-bg-warm rounded-2xl border border-surface-border">
              <span className="text-xs text-muted block mb-0.5">Buyurtma raqami:</span>
              <span className="font-mono font-bold text-brand text-base tracking-wider">
                #{orderNumber}
              </span>
            </div>
          )}

          <p className="text-xs text-muted leading-relaxed">
            Oshpazlarimiz qozon boshida taomingizni tayyorlashga kirishdilar. 30 daqiqa ichida yetib boramiz!
          </p>

          <button
            onClick={onClose}
            className="btn-primary btn-md w-full gap-2 justify-center shadow-brand-sm"
          >
            <Home size={16} />
            <span>{t('success.back')}</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
