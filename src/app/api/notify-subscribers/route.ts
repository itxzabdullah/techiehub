import { NextResponse } from "next/server";
import { notifySubscribers } from "@/lib/email/eventNotification";

export async function POST(request: Request) {
  try {
    const event = await request.json();

    if (
      !event.id ||
      !event.title ||
      !event.category ||
      !event.event_date ||
      !event.location ||
      !event.organizer
    ) {
      return NextResponse.json(
        { error: "Incomplete event data." },
        { status: 400 }
      );
    }

    const result = await notifySubscribers({
      id: event.id,
      title: event.title,
      category: event.category,
      event_date: event.event_date,
      location: event.location,
      organizer: event.organizer,
      image_url: event.image_url ?? null,
    });

    return NextResponse.json({
      message: `Notifications sent to ${result.sent} subscriber${
        result.sent === 1 ? "" : "s"
      }.`,
      sent: result.sent,
      failed: result.failed,
    });
  } catch (error) {
    console.error("Notification error:", error);

    return NextResponse.json(
      {
        error: "Failed to send subscriber notifications.",
      },
      { status: 500 }
    );
  }
}