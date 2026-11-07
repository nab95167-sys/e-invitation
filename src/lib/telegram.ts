/**
 * Telegram Instant Notification Service
 * Sends beautiful Khmer alerts to Telegram Groups/Channels for:
 * - New RSVP confirmations
 * - New Wedding Gifts recorded
 * - New Wishes posted
 */
import { prisma } from "./prisma";

export interface TelegramConfig {
  token?: string;
  chatId?: string;
}

export async function sendTelegramNotification(
  htmlMessage: string,
  eventIdOrConfig?: string | TelegramConfig | null
): Promise<boolean> {
  let token: string | undefined;
  let chatId: string | undefined;

  if (typeof eventIdOrConfig === "object" && eventIdOrConfig !== null) {
    token = eventIdOrConfig.token;
    chatId = eventIdOrConfig.chatId;
  }

  // If not passed explicitly, attempt to load from database Event
  if (!token || !chatId) {
    try {
      let event = null;
      if (typeof eventIdOrConfig === "string" && eventIdOrConfig.trim()) {
        const idOrSlug = eventIdOrConfig.trim();
        event = await prisma.event.findFirst({
          where: {
            OR: [{ id: idOrSlug }, { slug: idOrSlug }],
          },
          select: { telegramBotToken: true, telegramChatId: true, contacts: true },
        });
      }

      // If not found by explicit ID, fallback to the latest active event
      if (!event) {
        event = await prisma.event.findFirst({
          orderBy: { updatedAt: "desc" },
          select: { telegramBotToken: true, telegramChatId: true, contacts: true },
        });
      }

      if (event) {
        token = token || event.telegramBotToken || undefined;
        chatId = chatId || event.telegramChatId || undefined;

        // Fallback: check if stored in contacts JSON
        if ((!token || !chatId) && event.contacts && event.contacts.startsWith("{")) {
          try {
            const parsed = JSON.parse(event.contacts);
            token = token || parsed.telegramBotToken;
            chatId = chatId || parsed.telegramChatId;
          } catch {}
        }
      }
    } catch (dbErr) {
      console.warn("Notice: could not load event telegram config from DB:", dbErr);
    }
  }

  // Fallback to process.env
  token = token || process.env.TELEGRAM_BOT_TOKEN;
  chatId = chatId || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram notification skipped: Bot Token or Chat ID not configured in Event or ENV.");
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn("Telegram sendMessage error response:", err);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Failed to send Telegram notification:", error);
    return false;
  }
}

export async function testTelegramNotification(token: string, chatId: string): Promise<{ success: boolean; message: string }> {
  try {
    const testMessage = `🎉 <b>ការតេស្តជោគជ័យ! (Test Successful)</b>\n\nប្រព័ន្ធ <b>Royal E-Invitation</b> បានភ្ជាប់ទៅកាន់ Telegram Bot នេះដោយជោគជ័យ ១០០%។ រាល់ពេលមានភ្ញៀវ RSVP ជូនពរ ឬកត់ចំណងដៃ ប្រព័ន្ធនឹងបាញ់សារមកទីនេះដោយស្វ័យប្រវត្តិ។`;
    const success = await sendTelegramNotification(testMessage, { token, chatId });
    if (success) {
      return { success: true, message: "ផ្ញើសារតេស្តទៅកាន់ Telegram បានជោគជ័យ!" };
    } else {
      return { success: false, message: "មិនអាចផ្ញើសារបានទេ។ សូមពិនិត្យ Bot Token ឬ Chat ID ម្តងទៀត។" };
    }
  } catch (e: any) {
    return { success: false, message: e?.message || "បរាជ័យក្នុងការតភ្ជាប់" };
  }
}
