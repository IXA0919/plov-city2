import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  Image as ImageIcon,
  KeyRound,
  Lock,
  LogOut,
  Package,
  Pencil,
  Percent,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Upload,
  UserCheck,
  Users,
  Utensils,
  X,
} from 'lucide-react'
import { categories, menuItems as starterMenu } from '@data/menuData'
import { formatPrice } from '@utils'
import {
  adminLogin,
  adminLogout,
  changeAdminPassword,
  getAdminAccountInfo,
  getAdminData,
  getAdminSession,
  removeOrder as deleteOrder,
  saveMenu as persistMenu,
  updateOrderStatus,
  uploadMenuImage,
} from '@services/adminApi'

const panelClasses = 'min-h-screen bg-[#F8F6F2] text-[#241F1B] font-sans antialiased'
const inputClasses = 'w-full rounded-2xl border border-[#E5E0D8] bg-white px-4 py-3 text-sm text-[#241F1B] outline-none transition placeholder:text-[#A89E94] focus:border-[#D94E1F] focus:ring-4 focus:ring-[#D94E1F]/10'
const buttonClasses = 'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

// ─── TAOMNI TAHRIRLASH / YANGI QO'SHISH MODALI ───
function ProductEditor({ item, onSave, onClose }) {
  const [draft, setDraft] = useState(() => {
    if (item) {
      return {
        ...item,
        price: Number(item.price) || 0,
        variants: item.variants ? JSON.parse(JSON.stringify(item.variants)) : null,
      }
    }
    return {
      id: `dish-${Date.now()}`,
      category: 'plov',
      emoji: '🍲',
      image: '',
      price: 45000,
      weight: '350 g',
      name: { uz: '', ru: '', en: '' },
      nameUz: '',
      description: { uz: '', ru: '', en: '' },
      descUz: '',
      variants: null,
      available: true,
    }
  })

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageError, setImageError] = useState(false)

  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))

  const updateName = (lang, value) => {
    setDraft((current) => ({
      ...current,
      name: { ...current.name, [lang]: value },
      ...(lang === 'uz' ? { nameUz: value } : {}),
      ...(lang === 'ru' ? { nameRu: value } : {}),
      ...(lang === 'en' ? { nameEn: value } : {}),
    }))
  }

  const updateDesc = (lang, value) => {
    setDraft((current) => ({
      ...current,
      description: { ...current.description, [lang]: value },
      ...(lang === 'uz' ? { descUz: value } : {}),
      ...(lang === 'ru' ? { descRu: value } : {}),
      ...(lang === 'en' ? { descEn: value } : {}),
    }))
  }

  const handleFileUpload = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Iltimos, faqat rasm faylini tanlang (JPEG, PNG, WebP).')
      return
    }
    setUploading(true)
    try {
      const optimizedUrl = await uploadMenuImage(file)
      update('image', optimizedUrl)
      setImageError(false)
    } catch (err) {
      alert('Rasmni yuklashda xatolik: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const updateVariant = (index, key, value) => {
    setDraft((current) => ({
      ...current,
      variants: current.variants.map((v, i) =>
        i === index ? { ...v, [key]: key === 'price' ? Number(value) : value } : v
      ),
    }))
  }

  const addVariant = () => {
    setDraft((current) => ({
      ...current,
      variants: [
        ...(current.variants || []),
        {
          id: `var-${Date.now()}`,
          nameUz: 'Yangi porsiya',
          nameRu: 'Новая порция',
          nameEn: 'New portion',
          price: current.price || 40000,
          weight: '350g',
        },
      ],
    }))
  }

  const removeVariant = (index) => {
    setDraft((current) => ({
      ...current,
      variants: current.variants.filter((_, i) => i !== index),
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!draft.name?.uz && !draft.nameUz) {
      alert('Iltimos, taomning o‘zbekcha nomini kiriting!')
      return
    }
    if (!draft.price || draft.price <= 0) {
      alert('Iltimos, to‘g‘ri narx kiriting!')
      return
    }

    setSaving(true)
    try {
      await onSave({
        ...draft,
        price: Number(draft.price),
        nameUz: draft.name?.uz || draft.nameUz,
        descUz: draft.description?.uz || draft.descUz,
      })
      onClose()
    } catch (err) {
      alert('Saqlashda xatolik yuz berdi: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-5"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={submit}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8 border border-[#ECE7E0]"
      >
        <div className="mb-6 flex items-start justify-between border-b border-[#F0ECE6] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#241F1B]">
              {item ? 'Taomni tahrirlash' : 'Yangi taom qo‘shish'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#81776E]">
              Nom, narx, porsiyalar va yangi fotosuratni shu yerda sozlang.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl p-2.5 text-[#81776E] hover:bg-[#F5F1EC] hover:text-[#241F1B] transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          {/* 1. Nomlar */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#6D6259]">
                Taom nomi (O‘zbekcha) *
              </label>
              <input
                required
                className={`${inputClasses} mt-1.5`}
                placeholder="Masalan: Maxsus To‘y Oshi"
                value={draft.name?.uz || draft.nameUz || ''}
                onChange={(e) => updateName('uz', e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#6D6259]">
                Kategoriya *
              </label>
              <select
                className={`${inputClasses} mt-1.5`}
                value={draft.category}
                onChange={(e) => update('category', e.target.value)}
              >
                {categories
                  .filter((c) => c.id !== 'all')
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.nameUz}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* 2. Narx va Vazn */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#6D6259]">
                Asosiy Narxi (so‘mda) *
              </label>
              <div className="relative mt-1.5">
                <input
                  required
                  min="0"
                  step="500"
                  type="number"
                  className={`${inputClasses} pr-16 font-bold text-[#D94E1F]`}
                  value={draft.price}
                  onChange={(e) => update('price', Number(e.target.value))}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#81776E]">
                  so‘m
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#81776E]">
                Ko‘rinishi: <b>{formatPrice(draft.price || 0)} so‘m</b>
              </p>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#6D6259]">
                Vazni / Porsiya hajmi
              </label>
              <input
                className={`${inputClasses} mt-1.5`}
                placeholder="Masalan: 350 g yoki 1 lagan"
                value={draft.weight || ''}
                onChange={(e) => update('weight', e.target.value)}
              />
            </div>
          </div>

          {/* 3. Boshqa tillardagi nomlar */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#6D6259]">Nomi (Ruscha)</label>
              <input
                className={`${inputClasses} mt-1.5`}
                placeholder="Masalan: Праздничный плов"
                value={draft.name?.ru || draft.nameRu || ''}
                onChange={(e) => updateName('ru', e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#6D6259]">Nomi (Inglizcha)</label>
              <input
                className={`${inputClasses} mt-1.5`}
                placeholder="Masalan: Wedding Special Plov"
                value={draft.name?.en || draft.nameEn || ''}
                onChange={(e) => updateName('en', e.target.value)}
              />
            </div>
          </div>

          {/* 4. Rasm sozlamasi: Fayldan yuklash yoki URL */}
          <div className="rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6D6259]">
                Taom fotosurati
              </label>
              {draft.image && (
                <button
                  type="button"
                  onClick={() => update('image', '')}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Rasmni o‘chirish
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 items-center">
              <div>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#D94E1F]/30 bg-white p-3.5 text-center text-sm font-bold text-[#D94E1F] hover:bg-[#D94E1F]/5 transition">
                  <Upload size={18} />
                  <span>{uploading ? 'Yuklanmoqda...' : 'Kompyuterdan rasm yuklash'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={uploading}
                    onChange={(e) => handleFileUpload(e.target.files?.[0])}
                  />
                </label>
              </div>

              <div>
                <input
                  className={inputClasses}
                  placeholder="Yoki rasm havolasini (URL) kiriting"
                  value={draft.image?.startsWith('data:') ? '' : draft.image || ''}
                  onChange={(e) => {
                    update('image', e.target.value)
                    setImageError(false)
                  }}
                />
              </div>
            </div>

            {/* Rasm Preview */}
            {draft.image ? (
              <div className="relative mt-2 overflow-hidden rounded-2xl border border-[#E5E0D8]">
                <img
                  src={draft.image}
                  alt="Taom fotosurati"
                  onError={() => setImageError(true)}
                  className="h-44 w-full object-cover"
                />
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-xs font-bold text-white">
                    Rasm manzili noto‘g‘ri yoki yuklab bo‘lmadi
                  </div>
                )}
                <div className="absolute bottom-2 right-2 rounded-xl bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                  Faol rasm
                </div>
              </div>
            ) : (
              <div className="flex h-24 w-full items-center justify-center rounded-2xl border border-dashed border-[#DDD7CD] bg-white text-xs text-[#A89E94]">
                <ImageIcon size={20} className="mr-2 opacity-50" /> Rasm tanlanmagan
              </div>
            )}
          </div>

          {/* 5. Tavsif */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#6D6259]">
              Qisqacha tavsifi (O‘zbekcha)
            </label>
            <textarea
              rows={2}
              className={`${inputClasses} mt-1.5`}
              placeholder="Masalan: Lazer guruchi, mayin lahm mol go‘shti, sariq sabzi..."
              value={draft.description?.uz || draft.descUz || ''}
              onChange={(e) => updateDesc('uz', e.target.value)}
            />
          </div>

          {/* 6. Porsiya variantlari (Variants) */}
          <div className="rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6D6259]">
                  Porsiya narxlari (0.5 kg, 1 kg va boshqalar)
                </p>
                <p className="text-[11px] text-[#81776E]">
                  Mijoz har xil hajm yoki porsiya tanlashi mumkin bo‘lsa qo‘shing.
                </p>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-[#D94E1F] border border-[#D94E1F]/20 hover:bg-[#D94E1F]/5 transition"
              >
                <Plus size={14} /> Variant qo‘shish
              </button>
            </div>

            {draft.variants && draft.variants.length > 0 ? (
              <div className="space-y-2.5">
                {draft.variants.map((variant, index) => (
                  <div
                    key={variant.id || index}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-2 items-center rounded-xl bg-white p-2.5 border border-[#EBE6DF]"
                  >
                    <input
                      className="rounded-xl border border-[#E5E0D8] px-3 py-2 text-xs font-semibold outline-none focus:border-[#D94E1F]"
                      placeholder="Masalan: 0.5 kg (lagan)"
                      value={variant.nameUz || variant.weight || ''}
                      onChange={(e) => updateVariant(index, 'nameUz', e.target.value)}
                    />
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="500"
                        className="w-full rounded-xl border border-[#E5E0D8] px-3 py-2 pr-12 text-xs font-bold text-[#D94E1F] outline-none focus:border-[#D94E1F]"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', e.target.value)}
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#81776E]">
                        so‘m
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="rounded-xl p-2 text-[#81776E] hover:bg-red-50 hover:text-red-600 transition"
                      title="Variantni o‘chirish"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#A89E94] italic">
                Alohida porsiya variantlari kiritilmagan. Yuqoridagi asosiy narx ishlatiladi.
              </p>
            )}
          </div>

          {/* 7. Sotuv holati */}
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#ECE7E0] bg-white p-4">
            <input
              type="checkbox"
              checked={draft.available !== false}
              onChange={(e) => update('available', e.target.checked)}
              className="h-5 w-5 rounded-lg accent-[#D94E1F]"
            />
            <div>
              <p className="text-sm font-bold text-[#241F1B]">Menyuda sotuvda ko‘rsatilsin</p>
              <p className="text-xs text-[#81776E]">
                Belgilanmasa, taom menyuda yashiriladi va mijozlar uni buyurtma qila olmaydi.
              </p>
            </div>
          </label>
        </div>

        {/* Modal Tugmalari */}
        <div className="mt-8 flex justify-end gap-3 border-t border-[#F0ECE6] pt-4">
          <button
            type="button"
            onClick={onClose}
            className={`${buttonClasses} bg-[#F4F0EA] text-[#6D6259] hover:bg-[#EAE4DC]`}
          >
            Bekor qilish
          </button>
          <button
            disabled={saving || uploading}
            type="submit"
            className={`${buttonClasses} bg-[#D94E1F] text-white hover:bg-[#B83D14] shadow-lg shadow-[#D94E1F]/20`}
          >
            <Save size={18} />
            {saving ? 'Saqlanmoqda...' : 'O‘zgarishlarni saqlash'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── BUYURTMALAR JADVALI ───
function OrdersTable({ orders, onDelete, onStatusChange }) {
  if (!orders || !orders.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#DDD7CD] bg-white p-10 text-center">
        <Package size={36} className="mx-auto text-[#A89E94] opacity-50 mb-3" />
        <h3 className="text-base font-extrabold text-[#241F1B]">Hozircha buyurtmalar yo‘q</h3>
        <p className="mt-1 text-xs text-[#81776E]">
          Mijozlar saytdan yangi zakaz berishganda, ular darhol shu yerda paydo bo‘ladi.
        </p>
      </div>
    )
  }

  const statusBadges = {
    new: { label: 'Yangi buyurtma', bg: 'bg-amber-50 text-amber-800 border-amber-200' },
    preparing: { label: 'Tayyorlanmoqda', bg: 'bg-blue-50 text-blue-800 border-blue-200' },
    delivered: { label: 'Yetkazildi', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    cancelled: { label: 'Bekor qilingan', bg: 'bg-red-50 text-red-800 border-red-200' },
  }

  return (
    <div className="space-y-3.5">
      {orders.map((order) => {
        const status = statusBadges[order.status] || statusBadges.new
        return (
          <article
            key={order.orderNumber}
            className="rounded-2xl border border-[#ECE7E0] bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-[#241F1B]">
                    #{order.orderNumber}
                  </span>
                  <span className={`rounded-xl border px-2.5 py-0.5 text-xs font-bold ${status.bg}`}>
                    {status.label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#81776E] flex items-center gap-1.5">
                  <Clock size={13} />
                  {new Date(order.recordedAt || order.createdAt).toLocaleString('uz-UZ', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                <div className="mt-2.5 text-sm font-bold text-[#241F1B]">
                  {order.customer?.name} ·{' '}
                  <a
                    href={`tel:${order.customer?.phone?.replace(/\D/g, '')}`}
                    className="text-[#D94E1F] hover:underline"
                  >
                    {order.customer?.phone}
                  </a>
                </div>
                <p className="mt-1 text-xs text-[#6D6259]">
                  {order.deliveryType === 'pickup'
                    ? `🏃 Filialdan olib ketish: ${order.selectedBranch || 'Markaziy filial'}`
                    : `🚚 Yetkazib berish manzili: ${order.customer?.address || 'Keltirilmagan'}`}
                </p>
                {order.note && (
                  <p className="mt-1.5 text-xs italic text-[#81776E] bg-[#FAF8F5] p-2 rounded-xl border border-[#F0ECE6]">
                    💬 Izoh: &ldquo;{order.note}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-lg font-black text-[#D94E1F]">
                  {formatPrice(order.totalPrice)} so‘m
                </span>

                <div className="flex items-center gap-1.5">
                  <select
                    className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-2.5 py-1 text-xs font-bold text-[#6D6259] outline-none"
                    value={order.status || 'new'}
                    onChange={(e) => onStatusChange(order.orderNumber, e.target.value)}
                  >
                    <option value="new">Yangi</option>
                    <option value="preparing">Tayyorlanmoqda</option>
                    <option value="delivered">Yetkazildi</option>
                    <option value="cancelled">Bekor qilindi</option>
                  </select>

                  <button
                    title="Buyurtmani ro‘yxatdan o‘chirish"
                    onClick={() => onDelete(order.orderNumber)}
                    className="rounded-xl p-2 text-[#A89E94] hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Buyurtma qilingan taomlar */}
            <div className="mt-4 border-t border-[#F0ECE6] pt-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#A89E94] mb-1.5">
                Taomlar tarkibi:
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-medium text-[#4D453E]">
                {order.items?.map((item, index) => (
                  <span
                    key={`${item.id}-${index}`}
                    className="rounded-xl bg-[#F7F5F1] px-2.5 py-1 border border-[#EAE5DE]"
                  >
                    {item.nameUz || item.name?.uz || 'Taom'} ×{' '}
                    <b className="text-[#D94E1F]">{item.quantity}</b>{' '}
                    ({formatPrice(item.price)} so‘m)
                  </span>
                ))}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

// ─── ASOSIY ADMIN PANEL KOMPONENTI ───
export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Login formasi
  const [identifier, setIdentifier] = useState('admin')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Asosiy ma'lumotlar
  const [data, setData] = useState({
    menu: [],
    orders: [],
    stats: {
      visitors: 0,
      orderedVisitors: 0,
      browsingOnly: 0,
      orders: 0,
      totalRevenue: 0,
      conversionRate: '0.0',
    },
  })

  const [tab, setTab] = useState('overview') // overview, menu, orders, security
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editor, setEditor] = useState(null)
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')

  // Parol o'zgartirish formasi
  const [accountInfo, setAccountInfo] = useState({ username: 'admin' })
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [newPassConfirm, setNewPassConfirm] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [passwordChangeNotice, setPasswordChangeNotice] = useState({ type: '', text: '' })

  const refresh = async () => {
    try {
      const result = await getAdminData()
      if (!result.menu || !result.menu.length) {
        await persistMenu(starterMenu)
        result.menu = starterMenu
      }
      setData(result)
      setAccountInfo(getAdminAccountInfo())
    } catch (err) {
      console.warn('Ma’lumotlarni yangilashda xatolik:', err)
    }
  }

  useEffect(() => {
    getAdminSession()
      .then((valid) => {
        if (valid) {
          setAuthenticated(true)
          refresh()
        }
      })
      .finally(() => setLoading(false))
  }, [])

  // Menyu filtratsiyasi
  const visibleMenu = useMemo(() => {
    return data.menu.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      const name = (item.name?.uz || item.nameUz || '').toLowerCase()
      const matchesQuery = !query || name.includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [data.menu, query, selectedCategory])

  // Login funksiyasi
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      await adminLogin(identifier, password)
      setAuthenticated(true)
      setPassword('')
      await refresh()
    } catch (err) {
      setLoginError(err.message || 'Noto‘g‘ri ma’lumot kiritildi.')
    }
  }

  // Logout funksiyasi
  const handleLogout = async () => {
    await adminLogout()
    setAuthenticated(false)
    setTab('overview')
  }

  // Taomni saqlash
  const handleSaveItem = async (item) => {
    const exists = data.menu.some((old) => old.id === item.id)
    const menu = exists
      ? data.menu.map((old) => (old.id === item.id ? item : old))
      : [item, ...data.menu]

    await persistMenu(menu)
    setData((current) => ({ ...current, menu }))
    showToast('Menyu muvaffaqiyatli yangilandi!')
  }

  // Taomni o'chirish
  const handleDeleteItem = async (itemId, itemName) => {
    if (!window.confirm(`"${itemName}" taomini menyudan butunlay o‘chirishni xohlaysizmi?`)) {
      return
    }
    const menu = data.menu.filter((m) => m.id !== itemId)
    await persistMenu(menu)
    setData((current) => ({ ...current, menu }))
    showToast('Taom menyudan o‘chirildi.')
  }

  // Sotuv holatini almashtirish
  const handleToggleAvailable = async (item) => {
    const updated = { ...item, available: item.available === false }
    const menu = data.menu.map((old) => (old.id === item.id ? updated : old))
    await persistMenu(menu)
    setData((current) => ({ ...current, menu }))
    showToast(updated.available ? 'Taom sotuvga qaytarildi.' : 'Taom sotuvdan yashirildi.')
  }

  // Buyurtmani o'chirish
  const handleRemoveOrder = async (orderNumber) => {
    if (!window.confirm(`#${orderNumber} raqamli buyurtmani o‘chirishni tasdiqlaysizmi?`)) {
      return
    }
    await deleteOrder(orderNumber)
    await refresh()
    showToast('Buyurtma o‘chirildi.')
  }

  // Buyurtma statusini o'zgartirish
  const handleOrderStatusChange = async (orderNumber, newStatus) => {
    await updateOrderStatus(orderNumber, newStatus)
    await refresh()
    showToast('Buyurtma holati yangilandi.')
  }

  // Standart menyuni qayta tiklash
  const handleResetMenu = async () => {
    if (!window.confirm("Barcha taomlarni dastlabki standart menyu holatiga qaytarishni xohlaysizmi?")) return
    await persistMenu(starterMenu)
    setData((current) => ({ ...current, menu: starterMenu }))
    showToast("Standart menyu muvaffaqiyatli tiklandi.")
  }

  // Parol o'zgartirish
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordChangeNotice({ type: '', text: '' })

    if (newPass !== newPassConfirm) {
      setPasswordChangeNotice({ type: 'error', text: 'Yangi parollar bir-biriga mos kelmadi!' })
      return
    }

    try {
      const res = await changeAdminPassword({
        currentPassword: currentPass,
        newPassword: newPass,
        newUsername: newUsername,
      })
      setPasswordChangeNotice({
        type: 'success',
        text: 'Admin paroli muvaffaqiyatli o‘zgartirildi! Yangi ma’lumotlaringizni yodda tuting.',
      })
      setCurrentPass('')
      setNewPass('')
      setNewPassConfirm('')
      setNewUsername('')
      setAccountInfo(getAdminAccountInfo())
    } catch (err) {
      setPasswordChangeNotice({ type: 'error', text: err.message })
    }
  }

  const showToast = (text) => {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 3000)
  }

  if (loading) {
    return (
      <div className={`${panelClasses} grid place-items-center`}>
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-[#D94E1F]" size={32} />
          <p className="text-sm font-bold text-[#81776E]">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  // ─── LOGIN EKRANI ("admin panel manga berilsin boshqalarga berilmasin") ───
  if (!authenticated) {
    return (
      <main className={`${panelClasses} grid place-items-center px-4 py-12`}>
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-3xl border border-[#ECE7E0] bg-white p-7 shadow-2xl sm:p-10"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D94E1F]/10 text-[#D94E1F]">
              <Lock size={28} />
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-800 border border-amber-200">
              Faqat egasi uchun
            </span>
          </div>

          <p className="text-xs font-extrabold uppercase tracking-widest text-[#D94E1F]">
            PLOV CITY RESTAURANT
          </p>
          <h1 className="mt-1 text-2xl font-black text-[#241F1B]">Admin Panelga Kirish</h1>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#81776E]">
            Ushbu panel faqatgina do‘kon egasi uchun mo‘ljallangan. Boshqa foydalanuvchilar kira olmaydi.
          </p>

          {/* Dastlabki kirish ko'rsatmasi */}
          <div className="mt-5 rounded-2xl bg-[#FAF8F5] p-3.5 border border-[#ECE7E0] text-xs text-[#6D6259] leading-relaxed">
            <p className="font-bold text-[#241F1B] mb-1 flex items-center gap-1.5">
              <KeyRound size={14} className="text-[#D94E1F]" /> Dastlabki kirish ma’lumotlari:
            </p>
            <p>Login: <code className="font-mono font-bold text-[#D94E1F]">admin</code></p>
            <p>Parol: <code className="font-mono font-bold text-[#D94E1F]">plovadmin2026</code></p>
            <p className="text-[11px] text-[#A89E94] mt-1">
              (Kirgach, &ldquo;Xavfsizlik&rdquo; bo‘limida parolni faqat o‘zingiz biladigan yangi maxfiy parolga almashtirishingiz mumkin)
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-[#6D6259]">Login yoki Email</label>
              <input
                autoFocus
                required
                className={`${inputClasses} mt-1`}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6D6259]">Maxfiy Parol</label>
              <div className="relative mt-1">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  className={`${inputClasses} pr-12`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#81776E] hover:text-[#241F1B]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {loginError && (
            <div className="mt-4 rounded-2xl bg-red-50 p-3.5 text-xs font-bold text-red-700 border border-red-200">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            className={`${buttonClasses} mt-6 w-full bg-[#D94E1F] py-3.5 text-white hover:bg-[#B83D14] shadow-lg shadow-[#D94E1F]/25`}
          >
            <ShieldCheck size={18} /> Xavfsiz Kirish
          </button>

          <a
            href="/"
            className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-[#81776E] hover:text-[#D94E1F] transition"
          >
            <ArrowLeft size={16} /> Asosiy saytga qaytish
          </a>
        </form>
      </main>
    )
  }

  // ─── ADMIN DASHBOARD ───
  const navTabs = [
    { id: 'overview', label: 'Statistika & Ko‘rsatkichlar', icon: BarChart3 },
    { id: 'menu', label: 'Menyu Boshqaruvi', icon: Utensils },
    { id: 'orders', label: 'Buyurtmalar Tarixi', icon: Package },
    { id: 'security', label: 'Xavfsizlik & Parol', icon: KeyRound },
  ]

  return (
    <div className={panelClasses}>
      {/* Yon Panel (Desktop) */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-[#E9E4DC] bg-white p-6 lg:flex">
        <a href="/" className="mb-8 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#D94E1F] text-2xl shadow-md">
            🍲
          </span>
          <div>
            <b className="block text-base tracking-tight text-[#241F1B]">PLOV CITY</b>
            <span className="text-[11px] font-bold text-[#81776E]">Egasi paneli</span>
          </div>
        </a>

        <nav className="space-y-1.5">
          {navTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-xs font-extrabold transition cursor-pointer ${
                tab === id
                  ? 'bg-[#D94E1F]/10 text-[#D94E1F]'
                  : 'text-[#71685F] hover:bg-[#F7F5F1] hover:text-[#241F1B]'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="rounded-2xl bg-[#FAF8F5] p-3.5 border border-[#ECE7E0] text-[11px] leading-relaxed text-[#81776E]">
            <p className="font-bold text-[#241F1B] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" /> Himoyalangan
            </p>
            Kirilgan: <b>{accountInfo.username}</b>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50/50 py-2.5 text-xs font-extrabold text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <LogOut size={16} /> Chiqish
          </button>
        </div>
      </aside>

      {/* Asosiy Ish Maydoni */}
      <div className="lg:pl-64">
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E9E4DC] bg-white/95 px-4 py-3.5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="text-xl">🍲</span>
            <span className="font-black text-sm text-[#241F1B]">PLOV CITY / Admin</span>
          </div>

          <div className="hidden text-sm font-bold text-[#81776E] lg:block">
            Boshqaruv / {navTabs.find((t) => t.id === tab)?.label}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={refresh}
              title="Ma’lumotlarni yangilash"
              className="rounded-2xl p-2.5 text-[#81776E] hover:bg-[#F5F1EC] transition cursor-pointer"
            >
              <RefreshCw size={17} />
            </button>

            <a
              href="/"
              className={`${buttonClasses} bg-[#F5F1EC] text-[#5E554D] hover:bg-[#EAE5DE] text-xs py-2`}
            >
              <Eye size={15} />
              <span className="hidden sm:inline">Saytni ko‘rish</span>
            </a>

            <button
              onClick={handleLogout}
              className={`${buttonClasses} bg-[#FCEEE9] text-[#B83D14] hover:bg-[#FAD9D0] text-xs py-2 lg:hidden`}
            >
              <LogOut size={15} />
            </button>
          </div>
        </header>

        {/* Mobil menyu navigatsiyasi */}
        <div className="flex border-b border-[#E9E4DC] bg-white px-2 overflow-x-auto lg:hidden">
          {navTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-3.5 py-3 text-xs font-bold transition ${
                tab === id
                  ? 'border-[#D94E1F] text-[#D94E1F]'
                  : 'border-transparent text-[#71685F]'
              }`}
            >
              <Icon size={16} />
              {label.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Asosiy Kontent */}
        <main className="mx-auto max-w-7xl p-4 sm:p-8">
          {/* Toast xabarnomasi */}
          {notice && (
            <div className="mb-6 flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs sm:text-sm font-bold text-emerald-800 shadow-sm animate-in fade-in">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              {notice}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              TAB 1: STATISTIKA VA KO'RSATKICHLAR
              "nechta odam zakaz berdi va kirib shunchaki chiqdi"
             ════════════════════════════════════════════════════════ */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#241F1B]">
                  Statistika va Tahlillar
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#81776E]">
                  Saytingizga kirgan mijozlar, berilgan buyurtmalar va konversiya ko‘rsatkichlari.
                </p>
              </div>

              {/* 4 ta asosiy KPI kartalari */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {/* 1. Jami kirganlar */}
                <div className="rounded-3xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#81776E]">
                      Saytga kirganlar
                    </span>
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                      <Users size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-[#241F1B]">{data.stats.visitors}</p>
                  <p className="mt-1 text-xs text-[#81776E]">Jami tashrif buyuruvchilar</p>
                </div>

                {/* 2. Buyurtma berganlar ("nechta odam zakaz berdi") */}
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Zakaz berganlar
                    </span>
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                      <UserCheck size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-emerald-900">{data.stats.orderedVisitors}</p>
                  <p className="mt-1 text-xs text-emerald-700 font-semibold">
                    Buyurtma bergan mijozlar soni
                  </p>
                </div>

                {/* 3. Kirib shunchaki chiqqanlar ("kirib shunchaki chiqdi") */}
                <div className="rounded-3xl border border-amber-200 bg-amber-50/40 p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      Shunchaki chiqqanlar
                    </span>
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                      <EyeOff size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-amber-900">{data.stats.browsingOnly}</p>
                  <p className="mt-1 text-xs text-amber-700 font-semibold">
                    Ko‘rib, buyurtmasiz chiqqanlar
                  </p>
                </div>

                {/* 4. Jami Buyurtmalar */}
                <div className="rounded-3xl border border-orange-200 bg-orange-50/40 p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D94E1F]">
                      Jami buyurtmalar
                    </span>
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#D94E1F] text-white shadow-md shadow-[#D94E1F]/20">
                      <Package size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-[#B83D14]">{data.stats.orders}</p>
                  <p className="mt-1 text-xs text-[#D94E1F] font-semibold">
                    Tushgan jami zakazlar soni
                  </p>
                </div>
              </div>

              {/* Qo'shimcha Kassa va Konversiya kartalari */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-[#ECE7E0] bg-white p-6 shadow-sm flex items-center gap-5">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-800">
                    <DollarSign size={28} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#81776E]">
                      Jami Tushum (Kassa)
                    </span>
                    <p className="text-2xl font-black text-[#241F1B] mt-0.5">
                      {formatPrice(data.stats.totalRevenue)} so‘m
                    </p>
                    <p className="text-xs text-[#81776E]">Bajarilgan buyurtmalar summasi</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-[#ECE7E0] bg-white p-6 shadow-sm flex items-center gap-5">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-violet-100 text-violet-800">
                    <TrendingUp size={28} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#81776E]">
                      Buyurtma Konversiyasi
                    </span>
                    <p className="text-2xl font-black text-violet-900 mt-0.5">
                      {data.stats.conversionRate}%
                    </p>
                    <p className="text-xs text-[#81776E]">
                      Har 100 tashrifdan nechta odam buyurtma berdi
                    </p>
                  </div>
                </div>
              </div>

              {/* Vizual Konversiya Solishtiruvi */}
              <div className="rounded-3xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
                <h3 className="text-sm font-extrabold text-[#241F1B] uppercase tracking-wider mb-2">
                  Tashrif buyuruvchilar tahlili
                </h3>
                <p className="text-xs text-[#81776E] mb-4">
                  Saytga kirgan har bir kishi avtomatik hisoblanadi. Buyurtma berganlar va bermay chiqqanlar nisbati:
                </p>

                {data.stats.visitors > 0 ? (
                  <div className="space-y-3">
                    <div className="h-4 w-full overflow-hidden rounded-full bg-amber-100 flex">
                      <div
                        style={{
                          width: `${(data.stats.orderedVisitors / data.stats.visitors) * 100}%`,
                        }}
                        className="bg-emerald-500 transition-all duration-500"
                        title={`Zakaz berganlar: ${data.stats.orderedVisitors}`}
                      />
                      <div
                        style={{
                          width: `${(data.stats.browsingOnly / data.stats.visitors) * 100}%`,
                        }}
                        className="bg-amber-400 transition-all duration-500"
                        title={`Shunchaki chiqqanlar: ${data.stats.browsingOnly}`}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-xs font-bold gap-2">
                      <span className="flex items-center gap-1.5 text-emerald-800">
                        <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
                        Buyurtma berganlar: {data.stats.orderedVisitors} kishi (
                        {((data.stats.orderedVisitors / data.stats.visitors) * 100).toFixed(1)}%)
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-800">
                        <span className="h-3 w-3 rounded-full bg-amber-400 inline-block" />
                        Shunchaki chiqqanlar: {data.stats.browsingOnly} kishi (
                        {((data.stats.browsingOnly / data.stats.visitors) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#A89E94] italic">
                    Hozircha tashriflar qayd etilmagan. Saytga birinchi bor kirilganda statistika shakllanadi.
                  </p>
                )}
              </div>

              {/* So'nggi buyurtmalar */}
              <div className="rounded-3xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-[#241F1B]">So‘nggi Buyurtmalar</h3>
                    <p className="text-xs text-[#81776E]">Yaqinda kelib tushgan buyurtmalar</p>
                  </div>
                  <button
                    onClick={() => setTab('orders')}
                    className="text-xs font-bold text-[#D94E1F] hover:underline"
                  >
                    Barcha buyurtmalar ({data.orders.length}) →
                  </button>
                </div>
                <OrdersTable
                  orders={data.orders.slice(0, 5)}
                  onDelete={handleRemoveOrder}
                  onStatusChange={handleOrderStatusChange}
                />
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              TAB 2: MENYU BOSHQARUVI
              "menyu ni ozgartira olsin rasmlarni ozgartira olsin narxini ozgartira olsin"
             ════════════════════════════════════════════════════════ */}
          {tab === 'menu' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#241F1B]">
                    Menyu Boshqaruvi
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-[#81776E]">
                    Taomlar narxini, suratlarini, nomini va sotuv holatini to‘g‘ridan-to‘g‘ri o‘zgartiring.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetMenu}
                    title="Menyuni dastlabki standart holatiga qaytarish"
                    className={`${buttonClasses} border border-[#ECE7E0] bg-white text-[#81776E] hover:bg-[#FAF8F5] text-xs py-2.5`}
                  >
                    Standart menyuni tiklash ↺
                  </button>
                  <button
                    onClick={() => setEditor({ item: null })}
                    className={`${buttonClasses} bg-[#D94E1F] text-white hover:bg-[#B83D14] shadow-lg shadow-[#D94E1F]/20`}
                  >
                    <Plus size={18} /> Yangi Taom Qo‘shish
                  </button>
                </div>
              </div>

              {/* Qidiruv va Kategoriya filtri */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81776E]"
                  />
                  <input
                    className={`${inputClasses} pl-10`}
                    placeholder="Taom nomi bo‘yicha qidirish..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`shrink-0 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#D94E1F] text-white shadow-sm'
                          : 'bg-white text-[#71685F] border border-[#E5E0D8] hover:bg-[#F5F1EC]'
                      }`}
                    >
                      {cat.emoji} {cat.nameUz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Taomlar ro'yxati */}
              <div className="rounded-3xl border border-[#ECE7E0] bg-white p-4 sm:p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-[#F0ECE6] pb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#81776E]">
                    Jami ko‘rsatilmoqda: <b>{visibleMenu.length} ta taom</b>
                  </span>
                </div>

                <div className="divide-y divide-[#F0ECE6]">
                  {visibleMenu.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 hover:bg-[#FAF8F5] p-2 rounded-2xl transition"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            className="h-16 w-16 shrink-0 rounded-2xl object-cover border border-[#E5E0D8]"
                          />
                        ) : (
                          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#F5F1EC] text-2xl border border-[#E5E0D8]">
                            {item.emoji || '🍽️'}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm sm:text-base font-black text-[#241F1B]">
                              {item.name?.uz || item.nameUz || 'Nomsiz taom'}
                            </p>
                            {item.available === false && (
                              <span className="shrink-0 rounded-lg bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-extrabold text-red-600">
                                Sotuvda yo‘q
                              </span>
                            )}
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-black text-[#D94E1F]">
                              {formatPrice(item.price)} so‘m
                            </span>
                            {item.weight && (
                              <span className="text-[#81776E]">· {item.weight}</span>
                            )}
                            {item.variants?.length > 0 && (
                              <span className="rounded-md bg-[#F4F0EA] px-1.5 py-0.5 text-[10px] font-bold text-[#81776E]">
                                {item.variants.length} ta porsiya
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Boshqaruv tugmalari */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          title={item.available === false ? 'Sotuvga chiqarish' : 'Sotuvdan yashirish'}
                          onClick={() => handleToggleAvailable(item)}
                          className={`rounded-xl p-2.5 transition cursor-pointer ${
                            item.available === false
                              ? 'text-red-500 hover:bg-red-50'
                              : 'text-[#81776E] hover:bg-[#F5F1EC] hover:text-[#241F1B]'
                          }`}
                        >
                          {item.available === false ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>

                        <button
                          title="Tahrirlash (Narx, Rasm, Nom)"
                          onClick={() => setEditor({ item })}
                          className="flex items-center gap-1 rounded-xl bg-[#FCEEE9] px-3 py-2 text-xs font-bold text-[#D94E1F] hover:bg-[#FAD9D0] transition cursor-pointer"
                        >
                          <Pencil size={15} /> Tahrirlash
                        </button>

                        <button
                          title="O‘chirish"
                          onClick={() =>
                            handleDeleteItem(item.id, item.name?.uz || item.nameUz || 'Taom')
                          }
                          className="rounded-xl p-2.5 text-[#A89E94] hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              TAB 3: BUYURTMALAR TARIXI
             ════════════════════════════════════════════════════════ */}
          {tab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#241F1B]">
                  Buyurtmalar Tarixi ({data.orders.length})
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#81776E]">
                  Saytdan kelib tushgan barcha zakazlar, ularning summasi, kuryer/filial ma’lumotlari.
                </p>
              </div>

              <OrdersTable
                orders={data.orders}
                onDelete={handleRemoveOrder}
                onStatusChange={handleOrderStatusChange}
              />
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              TAB 4: XAVFSIZLIK & PAROL
              "admin panel manga berilsin boshqalarga berilmasin"
             ════════════════════════════════════════════════════════ */}
          {tab === 'security' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#241F1B]">
                  Xavfsizlik va Kirish Sozlamalari
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#81776E]">
                  Admin panel faqat sizga tegishli bo‘lishi uchun bu yerda o‘zingizning shaxsiy yangi parolingizni o‘rnatishingiz mumkin.
                </p>
              </div>

              <div className="rounded-3xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3.5 mb-6 border-b border-[#F0ECE6] pb-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#D94E1F]/10 text-[#D94E1F]">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#241F1B]">Admin Akkaunti</h3>
                    <p className="text-xs text-[#81776E]">
                      Joriy foydalanuvchi: <b className="text-[#241F1B]">{accountInfo.username}</b>
                    </p>
                  </div>
                </div>

                {passwordChangeNotice.text && (
                  <div
                    className={`mb-5 rounded-2xl p-4 text-xs font-bold border ${
                      passwordChangeNotice.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}
                  >
                    {passwordChangeNotice.text}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#6D6259]">Joriy Parol *</label>
                    <input
                      required
                      type="password"
                      className={`${inputClasses} mt-1`}
                      placeholder="Hozirgi parolingizni kiriting"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#6D6259]">
                      Yangi Login / Foydalanuvchi nomi (Ixtiyoriy)
                    </label>
                    <input
                      className={`${inputClasses} mt-1`}
                      placeholder="admin yoki o‘zingizning ismingiz"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#6D6259]">
                      Yangi Maxfiy Parol (kamida 5 ta belgi) *
                    </label>
                    <input
                      required
                      type="password"
                      className={`${inputClasses} mt-1`}
                      placeholder="Faqat o‘zingiz biladigan yangi maxfiy parol"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#6D6259]">
                      Yangi Parolni Tasdiqlang *
                    </label>
                    <input
                      required
                      type="password"
                      className={`${inputClasses} mt-1`}
                      placeholder="Yangi parolni qayta kiriting"
                      value={newPassConfirm}
                      onChange={(e) => setNewPassConfirm(e.target.value)}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className={`${buttonClasses} w-full bg-[#D94E1F] text-white hover:bg-[#B83D14] shadow-lg shadow-[#D94E1F]/20`}
                    >
                      <Save size={18} /> Parolni Yangilash
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Tahrirlash Modali */}
      {editor && (
        <ProductEditor
          item={editor.item}
          onClose={() => setEditor(null)}
          onSave={handleSaveItem}
        />
      )}
    </div>
  )
}
