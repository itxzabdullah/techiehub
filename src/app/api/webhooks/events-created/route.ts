import { NextRequest, NextResponse } from "next/server";
import { notifySubscribers } from "@/lib/email/eventNotification";

export async function POST(request: NextRequest) {
  try {
    // ---------------------------------------------------------
    // Verify webhook secret
    // ---------------------------------------------------------

    const webhookSecret = request.headers.get("x-webhook-secret");

    if (!process.env.EVENT_WEBHOOK_SECRET) {
      console.error("WEBHOOK_SECRET is not configured.");

      return NextResponse.json(
        { error: "Webhook secret is not configured." },
        { status: 500 }
      );
    }

    if (webhookSecret !== process.env.EVENT_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    // ---------------------------------------------------------
    // Read Supabase webhook payload
    // ---------------------------------------------------------

    const payload = await request.json();

    const event = payload.record;

    if (!event) {
      return NextResponse.json(
        { error: "No event record found." },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // Validate required event data
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // Send notifications
    // ---------------------------------------------------------

    const result = await notifySubscribers({
      id: event.id,
      title: event.title,
      category: event.category,
      event_date: event.event_date,
      location: event.location,
      organizer: event.organizer,
      registration_link: event.registration_link ?? null,
      image_url: event.image_url ?? null,
    });

    console.log(
      `Event notification completed: ${result.sent} sent, ${result.failed} failed.`
    );

    return NextResponse.json({
      success: true,
      message: `Notifications sent to ${result.sent} subscriber${
        result.sent === 1 ? "" : "s"
      }.`,
      sent: result.sent,
      failed: result.failed,
    });
  } catch (error) {
    console.error(
      "Event notification webhook error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to send event notifications.",
      },
      { status: 500 }
    );
  }
}