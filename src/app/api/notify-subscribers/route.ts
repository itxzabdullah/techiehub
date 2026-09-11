import { NextResponse } from "next/server";
import { notifySubscribers } from "@/lib/email/eventNotification";

type EventOperation = "INSERT" | "UPDATE";

export async function POST(request: Request) {
  try {
    // ---------------------------------------------------------
    // Read Supabase webhook payload
    // ---------------------------------------------------------

    const payload = await request.json();

    const operation = payload.type as EventOperation;
    const event = payload.record;

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
    // Send notifications
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
      operation
    );

    console.log(
      `Event ${operation} notification completed: ` +
        `${result.sent} sent, ${result.failed} failed.`
    );

    // ---------------------------------------------------------
    // Response
    // ---------------------------------------------------------

    return NextResponse.json({
      success: true,
      operation,
      message: `${operation === "INSERT" ? "New event" : "Event update"} notifications sent to ${
        result.sent
      } subscriber${result.sent === 1 ? "" : "s"}.`,
      sent: result.sent,
      failed: result.failed,
    });
  } catch (error) {
    console.error("Event notification webhook error:", error);

    return NextResponse.json(
      {
        error: "Failed to send subscriber notifications.",
      },
      { status: 500 }
    );
  }
}