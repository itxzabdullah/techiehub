import { NextResponse } from "next/server";
import { processNotificationQueue } from "@/lib/email/notificationQueue";

export async function POST(request: Request) {
  try {
    const cronSecret = request.headers.get("x-cron-secret");

    if (!process.env.CRON_SECRET) {
      console.error("CRON_SECRET is not configured.");

      return NextResponse.json(
        { error: "Cron secret is not configured." },
        { status: 500 }
      );
    }

    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const result = await processNotificationQueue();

    console.log("Notification queue processed:", result);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "Notification queue cron error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to process notification queue.",
      },
      { status: 500 }
    );
  }
}