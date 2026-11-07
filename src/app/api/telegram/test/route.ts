import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { testTelegramNotification } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { botToken, chatId } = await req.json().catch(() => ({}));
    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: "សូមបញ្ចូល Telegram Bot Token និង Chat ID" },
        { status: 400 }
      );
    }

    const result = await testTelegramNotification(botToken, chatId);
    if (result.success) {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
