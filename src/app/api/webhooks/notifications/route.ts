import { NextResponse } from "next/server";
import { notifySubscribers } from "@/lib/email/eventNotification";

type EventOperation = "INSERT" | "UPDATE";

const NOTIFICATION_FIELDS = [
  "title",
  "event_date",
  "location",
  "registration_link",
] as const;



export async function POST(request: Request) {
  try {
    // ---------------------------------------------------------
    // Verify webhook secret
    // ---------------------------------------------------------

    const webhookSecret = request.headers.get("x-webhook-secret");

    if (!process.env.EVENT_WEBHOOK_SECRET) {
      console.error("EVENT_WEBHOOK_SECRET is not configured.");

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

    const operation = payload.type as EventOperation;
    const event = payload.record;
    const oldRecord = payload.old_record;

    // ---------------------------------------------------------
    // Validate operation
    // ---------------------------------------------------------

    if (operation !== "INSERT" && operation !== "UPDATE") {
      return NextResponse.json(
        { error: "Unsupported webhook operation." },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // Validate event record
    // ---------------------------------------------------------

    if (!event) {
      return NextResponse.json(
        { error: "No event record found." },
        { status: 400 }
      );
    }

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
    // INSERT
    // ---------------------------------------------------------

    if (operation === "INSERT") {
      const result = await notifySubscribers(
        {
          id: event.id,
          title: event.title,
          category: event.category,
          event_date: event.event_date,
          location: event.location,
          organizer: event.organizer,
          image_url: event.image_url ?? null,
        },
        "INSERT"
      );

      console.log(
        `New event notification completed: ` +
        `${result.sent} sent, ${result.failed} failed.`
      );

      return NextResponse.json({
        success: true,
        operation: "INSERT",
        notified: true,
        sent: result.sent,
        failed: result.failed,
      });
    }

    // ---------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------

    if (!oldRecord) {
      return NextResponse.json(
        { error: "Previous event record not found." },
        { status: 400 }
      );
    }

    const changedFields = NOTIFICATION_FIELDS.filter(
      (field) => oldRecord[field] !== event[field]
    );

    // ---------------------------------------------------------
    // Check meaningful changes
    // ---------------------------------------------------------

    const meaningfulChange = changedFields.length > 0;

    if (!meaningfulChange) {
      console.log(
        `Event ${event.id} was updated, but no notification-relevant ` +
        `fields changed. No email sent.`
      );

      return NextResponse.json({
        success: true,
        operation: "UPDATE",
        notified: false,
        message: "No meaningful event changes detected. No emails sent.",
        sent: 0,
        failed: 0,
      });
    }

    // ---------------------------------------------------------
    // Send update notifications
    // ---------------------------------------------------------

    const result = await notifySubscribers(
      {
        id: event.id,
        title: event.title,
        category: event.category,
        event_date: event.event_date,
        location: event.location,
        organizer: event.organizer,
        image_url: event.image_url ?? null,
      },
      "UPDATE",
      changedFields
    );

    console.log(
      `Event update notification completed: ` +
      `${result.sent} sent, ${result.failed} failed.`
    );

    return NextResponse.json({
      success: true,
      operation: "UPDATE",
      notified: true,
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
        error: "Failed to send subscriber notifications.",
      },
      { status: 500 }
    );
  }
}