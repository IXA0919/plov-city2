/**
 * ═══════════════════════════════════════════════════════════════════
 * TELEGRAM BOT INTEGRATSIYA XIZMATI — PLOV CITY
 * ═══════════════════════════════════════════════════════════════════
 * Ushbu xizmat veb-saytdan berilgan barcha buyurtmalarni to'g'ridan-to'g'ri
 * sizning Telegram botingiz yoki operatorlar guruhiga/kanaliga yuboradi.
 * 
 * SOZLASH YO'RIQNOMASI:
 * 1. @BotFather orqali yangi bot oching va olingan tokenni TELEGRAM_BOT_TOKEN ga qo'ying.
 * 2. @userinfobot orqali o'zingizning yoki buyurtma tushadigan guruhning Chat ID sini oling
 *    va TELEGRAM_CHAT_ID ga qo'ying (guruh id si odatda minus bilan boshlanadi: -100...).
 */

// ─── CONFIG: Bot Token va Chat ID ───
export const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || "YOUR_BOT_TOKEN"
export const TELEGRAM_CHAT_ID   = import.meta.env.VITE_TELEGRAM_CHAT_ID   || "YOUR_CHAT_ID"

/**
 * Buyurtmani Telegram API orqali yuborish
 * @param {object} orderData - Buyurtma tafsilotlari
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function sendOrderToTelegram(orderData) {
  // Agar token yoki chat_id hali kiritilmagan bo'lsa (demo rejim)
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === "YOUR_BOT_TOKEN" || !TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID === "YOUR_CHAT_ID") {
    console.warn(
      "[Plov City Telegram Service] DIQQAT: TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID sozlanmagan. " +
      "Buyurtma konsolga chiqarildi, lekin Telegramga yuborilmadi."
    )
    console.log("BUYURTMA CHEKI (DEMO):", orderData)
    // Foydalanuvchi tajribasi to'xtab qolmasligi uchun demo rejimda 1 soniya kutib success qaytaramiz
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true, isDemo: true }
  }

  const endpoint = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  const formattedText = formatTelegramOrderMessage(orderData)

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: formattedText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    })

    const result = await response.json()

    if (!response.ok || !result.ok) {
      console.error("[Telegram Service Error]:", result)
      return { success: false, message: result.description || "Telegram API xatoligi" }
    }

    return { success: true }
  } catch (error) {
    console.error("[Telegram Network Error]:", error)
    return { success: false, message: "Internetga ulanishda xatolik yuz berdi" }
  }
}

/**
 * Buyurtma ma'lumotlarini Telegram uchun chiroyli HTML formatdagi chekka aylantirish
 */
function formatTelegramOrderMessage(order) {
  const {
    orderNumber,
    createdAt,
    customer,
    deliveryType,
    selectedBranch,
    paymentMethod,
    items,
    subtotal,
    deliveryFee,
    totalPrice,
    note,
  } = order

  const dateStr = new Date(createdAt || Date.now()).toLocaleString("uz-UZ", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Yetkazib berish usuliga ko'ra manzil matni
  let deliveryInfo = ""
  if (deliveryType === "pickup") {
    deliveryInfo = `🏃 <b>Qabul qilish:</b> Filialdan olib ketish\n🏢 <b>Filial:</b> ${selectedBranch || "Asosiy filial (Yunusobod)"}`
  } else {
    deliveryInfo = `🚚 <b>Qabul qilish:</b> Yetkazib berish (Kuryer)\n📍 <b>Manzil:</b> ${customer.address || "Ko'rsatilmagan"}`
  }

  // To'lov turi
  let paymentText = ""
  if (paymentMethod === "cash") paymentText = "💵 Naqd pul orqali"
  else if (paymentMethod === "card_online") paymentText = "💳 Click / Payme (Kuryerga)"
  else if (paymentMethod === "terminal") paymentText = "📟 Uzcard / Humo terminal"
  else paymentText = paymentMethod || "Naqd pul"

  // Taomlar ro'yxati
  const itemsText = items
    .map((item, index) => {
      const itemTitle = item.nameUz || item.name?.uz || "Taom"
      const itemWeight = item.weight ? ` (${item.weight})` : ""
      const itemPrice = (item.unitPrice || item.price || 0) * (item.quantity || 1)
      return `<b>${index + 1}.</b> ${item.emoji || "🍲"} <b>${escapeHtml(itemTitle)}${escapeHtml(itemWeight)}</b>\n   └ ${item.quantity} dona × ${formatPrice(item.unitPrice || item.price)} = <b>${formatPrice(itemPrice)} so'm</b>`
    })
    .join("\n\n")

  // Chek xabari
  return `
🔥 <b>YANGI BUYURTMA #${orderNumber}</b>
━━━━━━━━━━━━━━━━━━━━
📅 <b>Vaqti:</b> ${dateStr}

👤 <b>Mijoz:</b> ${escapeHtml(customer.name)}
📞 <b>Telefon:</b> <code>${customer.phone}</code>
${deliveryInfo}
💰 <b>To'lov turi:</b> ${paymentText}

🛒 <b>BUYURTMA TARKIBI:</b>
━━━━━━━━━━━━━━━━━━━━
${itemsText}
━━━━━━━━━━━━━━━━━━━━
📦 <b>Taomlar summasi:</b> ${formatPrice(subtotal)} so'm
🚚 <b>Yetkazib berish:</b> ${deliveryFee === 0 ? "<b>BEPUL 🎉</b>" : `${formatPrice(deliveryFee)} so'm`}
💵 <b>JAMI TO'LOV:</b> <u><b>${formatPrice(totalPrice)} so'm</b></u>

${note ? `📝 <b>Kuryerga izoh:</b> <i>«${escapeHtml(note)}»</i>\n` : ""}
⚡ <i>Iltimos, mijoz bilan zudlik bilan bog'laning!</i>
`.trim()
}

/**
 * Narxni formatlash yordamchisi (masalan: 42000 -> "42 000")
 */
function formatPrice(num) {
  return new Intl.NumberFormat("uz-UZ").format(num || 0)
}

/**
 * HTML inyeksiyalaridan himoya
 */
function escapeHtml(str) {
  if (!str) return ""
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/**
 * Unikal buyurtma raqamini generatsiya qilish (masalan: PC2611-4821)
 */
export function generateOrderNumber() {
  const date = new Date()
  const year = String(date.getFullYear()).slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const random = Math.floor(1000 + Math.random() * 9000)
  return `PC${year}${month}-${random}`
}
