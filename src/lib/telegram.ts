/**
 * Telegram Instant Notification Service
 * Sends beautiful Khmer alerts to Telegram Groups/Channels for:
 * - New RSVP confirmations
 * - New Wedding Gifts recorded
 * - New Wishes posted
 */

interface TelegramConfig {
  token?: string;
  chatId?: string;
}

export async function sendTelegramNotification(
  htmlMessage: string,
  customConfig?: TelegramConfig
): Promise<boolean> {
  const token = customConfig?.token || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = customConfig?.chatId || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // Gracefully skip if Telegram bot is not yet configured
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
